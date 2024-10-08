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
  CardContent,
  Card,
  Paper,
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
import ChatBox from "./Components/Chatbox";

const ViewPurchaseGroup: React.FC = () => {
  const [group, setGroup] = useState<PurchaseGroup | null>(null);
  const [statuses, setStatuses] = useState<string[]>([]); // State for chat statuses
  const location = useLocation();
  const { user } = useUser();
  const navigate = useNavigate();
  const groupId = location.state?.groupId;

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await getClient().get(`api/purchaseGroups/${groupId}`);
        setGroup(response.data);
        setStatuses(response.data.statuses || []); // Initialize statuses
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
      console.log("Request ID:", requestId);
      console.log(group);
      console.log("Status:", status);
      if (
        status === "approved" &&
        group?.maxMembersCount === group?.members.length?.toString()
      ) {
        toast.error("The group is full.");
        return;
      }
      const response = await getClient().put(
        `api/purchaseGroups/changeRequestStatus/${requestId}`,
        { status }
      );
      if (response.status === 200) {
        setGroup(response.data);
        toast.success(
          `Request ${
            status === "approved" ? "approved" : "rejected"
          } successfully!`
        );
      } else {
        toast.error(
          `Failed to ${status === "approved" ? "approve" : "reject"} request.`
        );
      }
    } catch (error) {
      console.error(`Error ${status}ing request:`, error);
      toast.error(
        `Error ${status === "approved" ? "approving" : "rejecting"} request.`
      );
    }
  };

  const handleEmailClick = (email: string) =>
    window.open(`mailto:${email}`, "_blank");
  const handleWhatsAppClick = (phone: string) =>
    window.open(`https://wa.me/${phone}`, "_blank");

  const handleSendStatus = async (newStatus: string) => {
    if (newStatus === "") return;

    try {
      const response = await getClient().put(
        `api/purchaseGroups/addStatus/${group!._id}`,
        { newStatus }
      );
      if (response.status === 200) {
        setGroup(response.data);
        setStatuses(response.data.statuses); // Update statuses
        toast.success("Status added successfully!");
      } else {
        toast.error("Failed to add status.");
      }
    } catch (error) {
      console.error("Error adding status:", error);
      toast.error("Error adding status.");
    }
  };

  const renderProperty = (label: string, value: React.ReactNode) => (
    <Typography
      variant="body2"
      color="textSecondary"
      sx={{
        whiteSpace: "normal",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {label}:{" "}
      <Typography variant="body1" component="span" color="textPrimary">
        {value}
      </Typography>
    </Typography>
  );

  if (!group) return <Typography variant="h6">Loading...</Typography>;

  const isCurrentUserOwner = group.owner._id === user._id;
  const pendingRequests = group.purchaseGroupRequests.filter(
    (request) => request.status === "pending"
  );
  const userRequest = group.purchaseGroupRequests.find(
    (request) => request.user._id === user._id
  );

  return (
    <Stack spacing={0} sx={{ padding: "20px", maxWidth: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
        <IconButton
          sx={{ marginRight: "10px" }}
          onClick={() => navigate("/purchasing-groups")}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" gutterBottom>
          {group.name}
        </Typography>
      </Box>

      {userRequest && (
        <Typography
          variant="body1"
          sx={{
            color: userRequest.status === "pending" ? "orange" : "red",
            marginBottom: "10px",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            {userRequest.status === "pending" && <HourglassEmptyIcon />}
            {userRequest.status === "rejected" && <HighlightOffIcon />}
            {userRequest.status === "pending" &&
              "Your request is pending approval."}
            {userRequest.status === "rejected" &&
              "Your request was rejected by the admin of the group."}
          </Stack>
        </Typography>
      )}

      <Accordion
        sx={{ margin: 0, borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">{"Group Details"}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div
            style={{
              whiteSpace: "normal",
              wordBreak: "break-word",
              overflowWrap: "break-word",
              display: "block",
            }}
          >
            {renderProperty("Description", group.description)}
          </div>
          {renderProperty("Max Members", group.maxMembersCount)}
          {renderProperty(
            "Participation Price",
            `$${Number(group.participationPrice).toLocaleString()}`
          )}
          {renderProperty("Estimated Profit %", group.profitPercentage)}
        </AccordionDetails>
      </Accordion>

      <Accordion
        sx={{ margin: 0, borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">{"Owner Details"}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {renderProperty("Name", group.owner.name)}
          {renderProperty("Username", group.owner.username)}
          {renderProperty("Email", group.owner.email)}
          {!isCurrentUserOwner && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "10px",
              }}
            >
              <Stack direction="row" spacing={1}>
                {group.owner.phoneNumber && (
                  <Tooltip title="Contact via WhatsApp">
                    <IconButton
                      color="primary"
                      onClick={() =>
                        handleWhatsAppClick(group.owner.phoneNumber)
                      }
                    >
                      <WhatsAppIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Contact via Email">
                  <IconButton
                    color="primary"
                    onClick={() => handleEmailClick(group.owner.email)}
                  >
                    <EmailIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>
          )}
        </AccordionDetails>
      </Accordion>

      <Accordion
        sx={{ margin: 0, borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">{"Statuses chat"}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ChatBox
            statuses={statuses}
            handleSendMessage={handleSendStatus}
            isOwner={isCurrentUserOwner}
          />
        </AccordionDetails>
      </Accordion>

      {group.property && (
        <Accordion
          sx={{ margin: 0, borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">{"Property Details"}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {renderProperty("Name", group.property.name)}
            {renderProperty("Description", group.property.description)}
            <PurchaseGroupImages images={group.property.images} />
          </AccordionDetails>
        </Accordion>
      )}

      <Accordion
        sx={{ margin: 0, borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">{"Members"}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {group.members.map((member) => (
              <ListItem key={member._id} sx={{ width: "100%" }}>
                <ListItemAvatar>
                  <UserAvatar user={member} height={40} width={40} />
                </ListItemAvatar>
                <ListItemText primary={member.name} secondary={member.email} />
                {isCurrentUserOwner && member._id !== group.owner._id && (
                  <Stack direction="row" spacing={1}>
                    {member.phoneNumber && (
                      <Tooltip title="Contact via WhatsApp">
                        <IconButton
                          color="primary"
                          onClick={() =>
                            handleWhatsAppClick(member.phoneNumber)
                          }
                        >
                          <WhatsAppIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Contact via Email">
                      <IconButton
                        color="primary"
                        onClick={() => handleEmailClick(member.email)}
                      >
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
        <Accordion
          sx={{ margin: 0, borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">{"Pending Requests"}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {pendingRequests.length === 0 ? (
              <Typography>
                {"There are no pending requests right now."}
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
                        {renderProperty(
                          "Price to Invest",
                          `$${Number(request.priceToInvest).toLocaleString()}`
                        )}
                        {renderProperty("Description", request.description)}
                        <Grid container spacing={2} sx={{ marginTop: "10px" }}>
                          <Grid item>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() =>
                                handleStatusChange(request._id, "approved")
                              }
                            >
                              {"Approve"}
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
                              {"Reject"}
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
