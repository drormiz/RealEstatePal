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
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { getClient } from "../../../../axios";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty"; // Add this for pending
import { toast } from "react-toastify";
import { useUser } from "../../contexts/UserContext";

interface PurchaseGroup {
  _id: string;
  name: string;
  description: string;
  members: { _id: string; name: string; username: string; email: string }[];
  maxMembersCount: Number;
  participationPrice: Number;
  profitPercentage: Number;
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
    };
  }[];
  owner: {
    _id: string;
    name: string;
    username: string;
    email: string;
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
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                {renderProperty("Name", group.owner.name)}
                {renderProperty("Username", group.owner.username)}
                {renderProperty("Email", group.owner.email)}
              </CardContent>
            </Card>
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
                Description: {group.property.description}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Max Members: {group.property.maxMembersCount}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Participation Price: {group.property.participationPrice}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Profit %: {group.property.profitPercentage}
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
                        <Divider style={{ margin: "10px 0" }} />
                        {renderProperty("Description", request.description)}
                        {renderProperty(
                          "Price to Invest",
                          request.priceToInvest
                        )}
                        <Grid
                          container
                          justifyContent="space-between"
                          alignItems="center"
                          style={{
                            marginTop: "10px",
                            paddingLeft: "15px",
                            paddingRight: "15px",
                          }}
                        >
                          <Grid item>
                            <IconButton
                              color="primary"
                              onClick={() =>
                                handleStatusChange(request._id, "approved")
                              }
                            >
                              <CheckCircleOutlineIcon />
                            </IconButton>
                          </Grid>
                          <Grid item>
                            <IconButton
                              color="error"
                              onClick={() =>
                                handleStatusChange(request._id, "rejected")
                              }
                            >
                              <HighlightOffIcon />
                            </IconButton>
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
