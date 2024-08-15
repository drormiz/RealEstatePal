import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  IconButton,
  Divider,
  Tooltip,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { getClient } from "../../../../axios";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty"; // Add this for pending
import { toast } from "react-toastify";
import { useUser } from "../../contexts/UserContext";
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
  image: string;
}

const ViewPurchaseGroup: React.FC = () => {
  const [group, setGroup] = useState<PurchaseGroup | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
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
          `Request ${
            status === "approved" ? "approved" : "rejected"
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
    return <Typography variant="h6">Loading...</Typography>;
  }

  const pendingRequests = group.purchaseGroupRequests.filter(
    (request) => request.status === "pending"
  );

  const isCurrentUserOwner = group.owner._id === user._id;
  const userRequest = findUserRequest();
  const renderContactIcons = (phoneNumber?: string, email?: string) => (
    <Grid container spacing={12} justifyContent="center">
      {phoneNumber ? (
        <>
          <Grid item>
            <Tooltip title="Contact via WhatsApp">
              <IconButton
                color="primary"
                onClick={() => phoneNumber && handleWhatsAppClick(phoneNumber)}
              >
                <WhatsAppIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title="Contact via Email">
              <IconButton
                color="primary"
                onClick={() => email && handleEmailClick(email)}
              >
                <EmailIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </>
      ) : (
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <Tooltip title="Contact via Email">
            <IconButton
              color="primary"
              onClick={() => email && handleEmailClick(email)}
            >
              <EmailIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      )}
    </Grid>
  );

  return (
    <Container maxWidth="md" style={{ marginTop: "20px" }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {group.name}
          </Typography>
          <Typography variant="body1" paragraph>
            {group.description}
          </Typography>

          {userRequest && (
            <Typography
              variant="body1"
              style={{
                color: userRequest.status === "pending" ? "orange" : "red",
                paddingBottom: "16px",
              }}
            >
              {userRequest.status === "pending" ? (
                <>
                  <HourglassEmptyIcon
                    style={{ verticalAlign: "middle", marginRight: "8px" }}
                  />
                  Your request is pending approval.
                </>
              ) : userRequest.status === "rejected" ? (
                <>
                  <HighlightOffIcon
                    style={{ verticalAlign: "middle", marginRight: "8px" }}
                  />
                  Your request was rejected by the Admin of the group.
                </>
              ) : null}
            </Typography>
          )}

          <Typography variant="h6" gutterBottom>
            Owner Details:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  {renderProperty("Name", group.owner.name)}
                  {renderProperty("Username", group.owner.username)}
                  {renderProperty("Email", group.owner.email)}
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
              <Typography variant="h6" gutterBottom paddingTop={5}>
                Property Details:
              </Typography>
              <Typography variant="body1">
                Name: {group.property.name}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Description: {group.description}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Max Members: {group.maxMembersCount}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Participation Price: {group.participationPrice}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Profit %: {group.profitPercentage}
              </Typography>
              {group.property.image && (
                <img
                  src={group.property.image}
                  alt={group.property.name}
                  style={{ maxWidth: "300px", maxHeight: "300px" }}
                />
              )}
            </>
          )}

          <Typography variant="h6" paddingTop={5}>
            Members:
          </Typography>
          <Grid container spacing={2}>
            {group.members.map((member) => (
              <Grid item xs={12} sm={6} md={4} key={member._id}>
                <Card>
                  <CardContent>
                    {renderProperty("Name", member.name)}
                    {renderProperty("Username", member.username)}
                    {renderProperty("Email", member.email)}
                    {isCurrentUserOwner &&
                      member._id !== group.owner._id &&
                      renderContactIcons(member.phoneNumber, member.email)}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {isCurrentUserOwner && (
            <>
              <Typography variant="h6" style={{ marginTop: "20px" }}>
                Pending Requests:
              </Typography>
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
                              Approve
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
                              Reject
                            </Button>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}

          <Grid container spacing={2} style={{ marginTop: "20px" }}>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/purchasing-groups")}
              >
                Back to Purchase Groups
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ViewPurchaseGroup;
