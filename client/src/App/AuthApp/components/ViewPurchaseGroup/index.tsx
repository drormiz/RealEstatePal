import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  IconButton,
  Divider,
  Stack,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Box,
  Tooltip,
  Button,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast } from "react-toastify";

import { getClient } from "../../../../axios";
import { useUser } from "../../contexts/UserContext";
import PurchaseGroupImages from "./Components/PurchaseGroupImages";
import UserAvatar from "../AppBar/components/UserAvatar";
import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

interface PurchaseGroup {
  _id: string;
  name: string;
  description: string;
  members: {
    _id: string;
    name: string;
    username: string;
    email: string;
    phoneNumber?: string;
  }[];
  maxMembersCount: number;
  participationPrice: number;
  profitPercentage: number;
  purchaseGroupRequests: {
    _id: string;
    priceToInvest: number;
    description: string;
    status: string;
    user: {
      _id: string;
      name: string;
      username: string;
      email: string;
      phoneNumber?: string;
    };
  }[];
  owner: {
    _id: string;
    name: string;
    username: string;
    email: string;
    phoneNumber?: string;
  };
  property: Property;
}

interface Property {
  _id: string;
  name: string;
  description: string;
  images: string[];
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
      if (status === "approved" && group?.maxMembersCount == group?.members.length) {
        toast.error("the group is full");
        return;
      }
      const response = await getClient().put(
        `api/purchaseGroups/changeRequestStatus/${requestId}`,
        { status }
      );

      if (response.status === 200) {
        setGroup(response.data);
        toast.success(
          `Request ${status === "approved" ? "approved" : "rejected"
          } successfully!`
        );
      } else {
        toast.error(
          `Failed to ${status === "approved" ? "approve" : "reject"} request`
        );
      }
    } catch (error) {
      console.error(`Error ${status}ing request:`, error);
      toast.error(
        `Error ${status === "approved" ? "approving" : "rejecting"} request`
      );
    }
  };

  const handleEmailClick = (email: string) => {
    window.open(`mailto:${email}`, "_blank");
  };

  const handleWhatsAppClick = (phone: string) => {
    window.open(`https://wa.me/${phone}`, "_blank");
  };

  const renderProperty = (label: string, value: React.ReactNode) => (
    <Typography variant="body2" color="textSecondary" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
      {label}:{" "}
      <Typography variant="body1" component="span" color="textPrimary">
        {value}
      </Typography>
    </Typography>
  );

  const findUserRequest = () => {
    if (group) {
      const userRequest = group.purchaseGroupRequests.find(
        (request) => request.user._id === user._id
      );
      return userRequest;
    }
    return null;
  };

  if (!group) {
    return <Typography variant="h6">{'Loading...'}</Typography>;
  }

  const pendingRequests = group.purchaseGroupRequests.filter(
    (request) => request.status === "pending"
  );

  const isCurrentUserOwner = group.owner._id === user._id;
  const userRequest = findUserRequest();
  const renderContactIcons = (phoneNumber?: string, email?: string) => (
    <Stack direction="row" spacing={1}>
      {phoneNumber &&
        <Tooltip title="Contact via WhatsApp">
          <IconButton
            color="primary"
            onClick={() => handleWhatsAppClick(phoneNumber)}
          >
            <WhatsAppIcon />
          </IconButton>
        </Tooltip>
      }
      {email &&
        <Tooltip title="Contact via Email">
          <IconButton
            color="primary"
            onClick={() => handleEmailClick(email)}>
            <EmailIcon />
          </IconButton>
        </Tooltip>
      }
    </Stack>
  );

  return (
    <Stack direction="column" spacing={4} sx={{ padding: '20px', maxWidth: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton sx={{ marginRight: '10px' }} onClick={() => navigate("/purchase-groups-feed")}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" gutterBottom>
          {group.name}
        </Typography>
      </Box>

      {userRequest && (
        <Typography variant={'body1'} sx={{ color: userRequest.status === "pending" ? "orange" : "red" }}>
          {userRequest.status === "pending" ? (
            <Stack direction="row" alignItems="center" spacing={1}>
              <HourglassEmptyIcon />
              {'Your request is pending approval.'}
            </Stack>
          ) : userRequest.status === "rejected" && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <HighlightOffIcon />
              {'Your request was rejected by the Admin of the group.'}
            </Stack>
          )}
        </Typography>
      )}

      <Box>
        <Typography variant="h6" gutterBottom>
          {'Group Details'}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                {renderProperty("Description", group.description)}
                {renderProperty("Max Members", group.maxMembersCount)}
                {renderProperty("Participation Price", `$${Number(group.participationPrice).toLocaleString()}`)}
                {renderProperty("Estimated Profit %", group.profitPercentage)}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          {'Owner Details'}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ marginBottom: '10px' }}>
                  {renderProperty("Name", group.owner.name)}
                  {renderProperty("Username", group.owner.username)}
                  {renderProperty("Email", group.owner.email)}
                </Box>
                {!isCurrentUserOwner &&
                  <Box sx={{ alignSelf: 'flex-end' }}>
                    {renderContactIcons(group.owner.phoneNumber, group.owner.email)}
                  </Box>}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {group.property && (
        <Box>
          <Typography variant="h6" gutterBottom>
            {'Property Details'}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  {renderProperty("Name", group.property.name)}
                  {renderProperty("Description", group.property.description)}
                  {renderProperty("Email", group.owner.email)}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <PurchaseGroupImages images={group.property.images} />
        </Box>
      )}

      <Box>
        <Typography variant="h6">
          {'Members'}
        </Typography>
        <List>
          {group.members.map((member) => (
            <ListItem key={member._id} sx={{ width: '100%' }}>
              <ListItemAvatar>
                <UserAvatar user={member} height={40} width={40} />
              </ListItemAvatar>
              <ListItemText
                primary={member.name}
                secondary={member.email}
              />
              {isCurrentUserOwner && member._id !== group.owner._id &&
                renderContactIcons(member.phoneNumber, member.email)}
            </ListItem>
          ))}
        </List>
      </Box>

      {isCurrentUserOwner && (
        <Box>
          <Typography variant="h6" style={{ marginTop: "20px" }}>
            {'Pending Requests'}
          </Typography>
          {pendingRequests.length === 0 ? (
            <Typography>
              {'There are no pending requests right now.'}
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {pendingRequests.map((request) => (
                <Grid item xs={12} sm={6} md={4} key={request._id}>
                  <Card>
                    <CardContent>
                      {renderProperty("Requested by", request.user.name)}
                      {renderProperty("Username", request.user.username)}
                      {renderProperty("Email", request.user.email)}
                      {renderProperty("Price to Invest", request.priceToInvest)}
                      {renderProperty("Description", request.description)}
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {renderContactIcons(request.user.phoneNumber, request.user.email)}
                      </Box>
                      <Divider style={{ margin: "10px 0" }} />
                      <Grid container spacing={2} justifyContent="center">
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
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleStatusChange(request._id, "rejected")}
                          >
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
        </Box>
      )}
    </Stack>
  );
};

export default ViewPurchaseGroup;
