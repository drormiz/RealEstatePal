import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  IconButton,
  Stack,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Box,
  Tooltip,
  Button,
  Divider,
} from "@mui/material";
import {
  CheckCircleOutline as CheckCircleOutlineIcon,
  HighlightOff as HighlightOffIcon,
  HourglassEmpty as HourglassEmptyIcon,
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";

import { getClient } from "../../../../axios";
import { useUser } from "../../contexts/UserContext";
import PurchaseGroupImages from "./Components/PurchaseGroupImages";
import UserAvatar from "../AppBar/components/UserAvatar";

interface PurchaseGroup {
  _id: string;
  name: string;
  description: string;
  members: User[];
  maxMembersCount: number;
  participationPrice: number;
  profitPercentage: number;
  purchaseGroupRequests: PurchaseGroupRequest[];
  owner: User;
  property: Property;
}

interface Property {
  _id: string;
  name: string;
  description: string;
  images: string[];
}

interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  phoneNumber?: string;
}

interface PurchaseGroupRequest {
  _id: string;
  priceToInvest: number;
  description: string;
  status: string;
  user: User;
}

const ViewPurchaseGroup: React.FC = () => {
  const [group, setGroup] = useState<PurchaseGroup | null>(null);
  const location = useLocation();
  const { user } = useUser();
  const navigate = useNavigate();
  const groupId = location.state?.groupId;

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await getClient().get(`api/purchaseGroups/${groupId}`);
        setGroup(response.data);
      } catch (error) {
        console.error("Error fetching purchase group details:", error);
      }
    };

    if (groupId) {
      fetchGroupDetails();
    }
  }, [groupId]);

  const handleStatusChange = async (requestId: string, status: string) => {
    try {
      if (status === "approved" && group?.maxMembersCount === group?.members.length) {
        toast.error("The group is full.");
        return;
      }
      const response = await getClient().put(
        `api/purchaseGroups/changeRequestStatus/${requestId}`,
        { status }
      );
      if (response.status === 200) {
        setGroup(response.data);
        toast.success(`Request ${status === "approved" ? "approved" : "rejected"} successfully!`);
      } else {
        toast.error(`Failed to ${status === "approved" ? "approve" : "reject"} request.`);
      }
    } catch (error) {
      console.error(`Error ${status}ing request:`, error);
      toast.error(`Error ${status === "approved" ? "approving" : "rejecting"} request.`);
    }
  };

  const handleEmailClick = (email: string) => window.open(`mailto:${email}`, "_blank");
  const handleWhatsAppClick = (phone: string) => window.open(`https://wa.me/${phone}`, "_blank");

  const renderProperty = (label: string, value: React.ReactNode) => (
    <Typography variant="body2" color="textSecondary" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
      {label}:{" "}
      <Typography variant="body1" component="span" color="textPrimary">
        {value}
      </Typography>
    </Typography>
  );

  if (!group) return <Typography variant="h6">{'Loading...'}</Typography>;

  const isCurrentUserOwner = group.owner._id === user._id;
  const pendingRequests = group.purchaseGroupRequests.filter(request => request.status === "pending");
  const userRequest = group.purchaseGroupRequests.find(request => request.user._id === user._id);

  return (
    <Stack spacing={4} sx={{ padding: '20px', maxWidth: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton sx={{ marginRight: '10px' }} onClick={() => navigate("/purchase-groups-feed")}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" gutterBottom>{group.name}</Typography>
      </Box>

      {userRequest && (
        <Typography variant="body1" sx={{ color: userRequest.status === "pending" ? "orange" : "red" }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            {userRequest.status === "pending" && <HourglassEmptyIcon />}
            {userRequest.status === "rejected" && <HighlightOffIcon />}
            {userRequest.status === "pending" ? 'Your request is pending approval.' : 'Your request was rejected by the Admin of the group.'}
          </Stack>
        </Typography>
      )}

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">{'Group Details'}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {renderProperty("Description", group.description)}
          {renderProperty("Max Members", group.maxMembersCount)}
          {renderProperty("Participation Price", `$${Number(group.participationPrice).toLocaleString()}`)}
          {renderProperty("Estimated Profit %", group.profitPercentage)}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">{'Owner Details'}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {renderProperty("Name", group.owner.name)}
          {renderProperty("Username", group.owner.username)}
          {renderProperty("Email", group.owner.email)}
          {!isCurrentUserOwner && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <Stack direction="row" spacing={1}>
                {group.owner.phoneNumber && (
                  <Tooltip title="Contact via WhatsApp">
                    <IconButton color="primary" onClick={() => handleWhatsAppClick(group.owner.phoneNumber)}>
                      <WhatsAppIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Contact via Email">
                  <IconButton color="primary" onClick={() => handleEmailClick(group.owner.email)}>
                    <EmailIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>
          )}
        </AccordionDetails>
      </Accordion>

      {group.property && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">{'Property Details'}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {renderProperty("Name", group.property.name)}
            {renderProperty("Description", group.property.description)}
            <PurchaseGroupImages images={group.property.images} />
          </AccordionDetails>
        </Accordion>
      )}

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">{'Members'}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {group.members.map((member) => (
              <ListItem key={member._id} sx={{ width: '100%' }}>
                <ListItemAvatar>
                  <UserAvatar user={member} height={40} width={40} />
                </ListItemAvatar>
                <ListItemText primary={member.name} secondary={member.email} />
                {isCurrentUserOwner && member._id !== group.owner._id && (
                  <Stack direction="row" spacing={1}>
                    {member.phoneNumber && (
                      <Tooltip title="Contact via WhatsApp">
                        <IconButton color="primary" onClick={() => handleWhatsAppClick(member.phoneNumber)}>
                          <WhatsAppIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Contact via Email">
                      <IconButton color="primary" onClick={() => handleEmailClick(member.email)}>
                        <EmailIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                )}
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      {isCurrentUserOwner && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">{'Pending Requests'}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {pendingRequests.length === 0 ? (
              <Typography>{'There are no pending requests right now.'}</Typography>
            ) : (
              <Grid container spacing={2}>
                {pendingRequests.map((request) => (
                  <Grid item xs={12} sm={6} md={4} key={request._id}>
                    <Card>
                      <CardContent>
                        {renderProperty("Requested by", request.user.name)}
                        {renderProperty("Username", request.user.username)}
                        {renderProperty("Email", request.user.email)}
                        {renderProperty("Price to Invest", `$${Number(request.priceToInvest).toLocaleString()}`)}
                        {renderProperty("Description", request.description)}
                        <Grid container spacing={2} sx={{ marginTop: '10px' }}>
                          <Grid item>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleStatusChange(request._id, "approved")}
                            >
                              {'Approve'}
                            </Button>
                          </Grid>
                          <Grid item>
                            <Button variant="contained" color="secondary" onClick={() => handleStatusChange(request._id, "rejected")}>
                              {'Reject'}
                            </Button>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </AccordionDetails>
        </Accordion>
      )}
    </Stack>
  );
};

export default ViewPurchaseGroup;
