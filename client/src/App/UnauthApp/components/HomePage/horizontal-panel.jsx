import React from "react";
import { useRef, useState, useEffect } from "react";
import { IconButton, Box } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const HorizontalPanel = ({ children, properties }) => {
  const propertyPanelRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const updateScrollButtons = () => {
      if (propertyPanelRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } =
          propertyPanelRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
      }
    };
    updateScrollButtons();
    const panel = propertyPanelRef.current;
    if (panel) {
      panel.addEventListener("scroll", updateScrollButtons);
    }
    return () => {
      if (panel) {
        panel.removeEventListener("scroll", updateScrollButtons);
      }
    };
  }, [properties]);

  const handleScroll = (direction) => {
    const scrollAmount = 550;
    if (propertyPanelRef.current) {
      const currentScrollPosition = propertyPanelRef.current.scrollLeft;
      const newPosition =
        direction === "left"
          ? currentScrollPosition - scrollAmount
          : currentScrollPosition + scrollAmount;

      propertyPanelRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      {canScrollLeft && (
        <IconButton
          sx={{
            position: "absolute",
            top: "50%",
            left: -20,
            zIndex: 10,
            transform: "translateY(-50%)",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.7)",
            },
          }}
          onClick={() => handleScroll("left")}
        >
          <ArrowBackIosNewIcon sx={{ color: "white" }} />
        </IconButton>
      )}
      <Box
        ref={propertyPanelRef}
        sx={{
          display: "flex",
          overflowX: "hidden",
          scrollBehavior: "smooth",
          padding: "20px 40px",
        }}
      >
        {children}
      </Box>
      {canScrollRight && (
        <IconButton
          sx={{
            position: "absolute",
            top: "50%",
            right: -35,
            zIndex: 10,
            marginRight: 2,
            transform: "translateY(-50%)",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.7)",
            },
          }}
          onClick={() => handleScroll("right")}
        >
          <ArrowForwardIosIcon sx={{ color: "white" }} />
        </IconButton>
      )}
    </>
  );
};

export default HorizontalPanel;
