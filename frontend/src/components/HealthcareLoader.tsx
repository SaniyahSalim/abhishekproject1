import React from "react";
import { Box, Typography } from "@mui/material";
import "../HeartbeatLoader.css"
const HeartbeatLoader: React.FC = () => {
  return (
  <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
        color: "white",
      }}
    >
      <div className="loader-container">
        <div className="cross"></div>
        <div className="ecg-circle"></div>
      </div>
      <Typography variant="h6" sx={{ mt: 4 }}>
        Processing patient data...
      </Typography>
    </Box>
  );
};

export default HeartbeatLoader;
