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
    <Typography variant="body2" color="textSecondary">
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
    <>
      {phoneNumber &&
        <>
          <Box>
            <Tooltip title="Contact via WhatsApp">
              <IconButton
                color="primary"
                onClick={() => phoneNumber && handleWhatsAppClick(phoneNumber)}
              >
                <WhatsAppIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </>}
      {email &&
        <Box>
          <Tooltip title={'Contact via Email'}>
            <IconButton
              color="primary"
              onClick={() => email && handleEmailClick(email)}>
              <EmailIcon />
            </IconButton>
          </Tooltip>
        </Box>
      }
    </>
  );

  return (
    <Stack direction={'row'} sx={{ padding: '20px' }}>
      <IconButton sx={{ alignSelf: 'start', margin: '5px 0px 0px 10px' }}>
        <ArrowBackIcon onClick={() => navigate("/purchase-groups-feed")} />
      </IconButton>
      <Box >
        <CardContent>
          <Stack direction={'row'} spacing={2} sx={{ alignItems: 'center' }}>
            <Typography variant="h4" gutterBottom>
              {group.name}
            </Typography>
            {userRequest && (
              <Typography
                variant={'body1'}
                sx={{ color: userRequest.status === "pending" ? "orange" : "red" }}>
                {userRequest.status === "pending" ? (
                  <>
                    <HourglassEmptyIcon
                      sx={{ justifyContent: "middle", marginRight: "8px" }}
                    />
                    {'Your request is pending approval.'}
                  </>
                ) : userRequest.status === "rejected" ? (
                  <>
                    <HighlightOffIcon
                      style={{ verticalAlign: "middle", marginRight: "8px" }}
                    />
                    {'Your request was rejected by the Admin of the group.'}
                  </>
                ) : null}
              </Typography>
            )}
          </Stack>
          <Typography variant="h6" gutterBottom marginTop={4}>
            {'Group Details'}
          </Typography>
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
          <Typography variant="h6" gutterBottom marginTop={4}>
            {'Owner Details'}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    {renderProperty("Name", group.owner.name)}
                    {renderProperty("Username", group.owner.username)}
                    {renderProperty("Email", group.owner.email)}
                  </Box>
                  {!isCurrentUserOwner &&
                    renderContactIcons(
                      group.owner.phoneNumber,
                      group.owner.email
                    )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          {group.property && (
            <>
              <Typography variant="h6" gutterBottom marginTop={4}>
                {'Property Details'}
              </Typography>
              <Grid item xs={12} sm={6} md={4} sx={{ marginBottom: '10px' }}>
                <Card>
                  <CardContent>
                    {renderProperty("Name", group.property.name)}
                    {renderProperty("Description", group.property.description)}
                    {renderProperty("Email", group.owner.email)}
                  </CardContent>
                </Card>
              </Grid>
              <PurchaseGroupImages images={group.property.images} />
            </>
          )}
          <Typography variant="h6" paddingTop={5}>
            {'Members'}
          </Typography>
          <List>
            {group.members.map((member) => (
              <ListItem key={member._id} sx={{ width: '50%' }}>
                <ListItemAvatar>
                  <UserAvatar user={member} height={40} width={40} />
                </ListItemAvatar>
                <ListItemText
                  primary={member.name}
                  secondary={member.email}
                />
                {isCurrentUserOwner &&
                  member._id !== group.owner._id &&
                  renderContactIcons(member.phoneNumber, member.email)}
              </ListItem>
            ))}
          </List>
          {isCurrentUserOwner && (
            <>
              <Typography variant="h6" style={{ marginTop: "20px" }}>
                {'Pending Requests'}
              </Typography>
              {
                pendingRequests.length == 0
                  ?
                  <Typography>
                    {'There are no pending requests right now.'}
                  </Typography>
                  : <Grid container spacing={2}>
                    {pendingRequests.map((request) => (
                      <Grid item xs={12} sm={6} md={4} key={request._id}>
                        <Card>
                          <CardContent>
                            {renderProperty("Requested by", request.user.name)}
                            {renderProperty("Username", request.user.username)}
                            {renderProperty("Email", request.user.email)}
                            {renderProperty(
                              "Price to Invest",
                              request.priceToInvest
                            )}
                            {renderProperty("Description", request.description)}

                            {renderContactIcons(
                              request.user.phoneNumber,
                              request.user.email
                            )}
                            <Divider style={{ margin: "10px 0" }} />
                            <Grid
                              container
                              spacing={6}
                              justifyContent={"center"}
                              style={{ top: "10px", position: "relative" }}
                            >
                              <Grid item>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() =>
                                    handleStatusChange(request._id, "approved")
                                  }
                                >
                                  {'Approve'}
                                </Button>
                              </Grid>
                              <Grid item>
                                <Button
                                  variant="contained"
                                  color="secondary"
                                  onClick={() =>
                                    handleStatusChange(request._id, "rejected")
                                  }
                                >
                                  {'Reject'}
                                </Button>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>}
            </>
          )}
        </CardContent>
      </Box>
    </Stack>
  );
};

export default ViewPurchaseGroup;
