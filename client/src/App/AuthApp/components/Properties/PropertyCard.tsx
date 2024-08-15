import React from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Box from "@mui/material/Box";
import { ArrowForward, Edit } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { useUser } from "../../contexts/UserContext";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const PropertyCard = ({ property }) => {
  const { user } = useUser();

  const isUserOwner = user._id === property.owner;

  return (
    <Card
      sx={{
        width: 300,
        display: "flex",
        flexDirection: "column",
        margin: "20px 0",
      }}
    >
      <Box sx={{ height: 200 }}>
        <Carousel
          sx={{
            height: "100%",
            maxHeight: "200px",
            "&. div": { height: "100%" },
          }}
          indicators={true}
          navButtonsAlwaysVisible={false}
          animation="slide"
          cycleNavigation={true}
          interval={3000}
        >
          {property.images.map((image, index) => {
            return (
              <img
                key={index}
                src={image}
                alt={`property-image-${index}`}
                style={{
                  width: "100%",
                  height: "160px",
                  objectFit: "fill",
                }}
              />
            );
          })}
        </Carousel>
      </Box>

      <CardContent sx={{ flex: 1 }}>
        <Typography gutterBottom variant="h6" component="div" fontWeight="bold">
          {property.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {`Meters: ${property.meters} | Rooms: ${property.numberOfRooms} | Type: ${property.type}`}
        </Typography>
        <Typography variant="h6" color="text.primary">
          ${property.price}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: "flex-end" }}>
        <IconButton
          component={Link}
          to={`/properties/${property._id}`}
          size="small"
          color="primary"
        >
          <ArrowForward />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default PropertyCard;
