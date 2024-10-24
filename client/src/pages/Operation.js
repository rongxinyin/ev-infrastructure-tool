import React, { useState } from "react";
import { Box, Button, Typography, styled } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Flex from '../components/Flex.js'; // Import the Flex component
import SiteAppBar from '../components/SiteAppBar.js'; // Import the SiteAppBar component

// visualization. will delete later
const Item = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function Operation() {
  let navigate = useNavigate(); // Navigate to different pages
  const [showFlexE, setShowFlexE] = useState(false);
  const [showFlexV, setShowFlexV] = useState(false);
  const [showData, setShowData] = useState(true); // Default to showing Data page

  const handleFlexEClick = () => {
    setShowFlexE(true);
    setShowFlexV(false);
    setShowData(false);
  };

  const handleFlexVClick = () => {
    setShowFlexE(false);
    setShowFlexV(true);
    setShowData(false);
  };

  const handleDataClick = () => {
    setShowFlexE(false);
    setShowFlexV(false);
    setShowData(true);
  };

  return (
    <Box bgcolor="primary.white" display="flex" height="100vh" sx={{ marginTop: 4 }}>
      {/* Render SiteAppBar with the hideFootnote prop */}
      {/* <SiteAppBar hideFootnote={true} /> */}

      {/* Left Panel */}
      <Box sx={{ width: 200, backgroundColor: "#2c3e50", padding: 2 }}>
        <Button
          variant="contained"
          fullWidth
          sx={{ marginBottom: 2, backgroundColor: showData ? "#1abc9c" : "#34495e" }}
          onClick={handleDataClick}
        >
          Data
        </Button>
        <Button
          variant="contained"
          fullWidth
          sx={{ marginBottom: 2, backgroundColor: showFlexE ? "#1abc9c" : "#34495e" }}
          onClick={handleFlexEClick}
        >
          Flex-E
        </Button>
        <Button
          variant="contained"
          fullWidth
          sx={{ backgroundColor: showFlexV ? "#1abc9c" : "#34495e" }}
          onClick={handleFlexVClick}
        >
          Flex-V
        </Button>
      </Box>

      {/* Content Panel */}
      <Box sx={{ flexGrow: 1, padding: 3 }}>
        {showData && <Flex />} {/* Render Flex component when Data is selected */}
        {showFlexE && (
          <Box>
            <Typography variant="h4">Flex-E Content</Typography>
            <Typography>This is the content for Flex-E.</Typography>
          </Box>
        )}
        {showFlexV && (
          <Box>
            <Typography variant="h4">Flex-V Content</Typography>
            <Typography>This is the content for Flex-V.</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
