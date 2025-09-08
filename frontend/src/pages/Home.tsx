import React from "react";
import { Typography, Button, Box,  Card, CardContent } from "@mui/material";
import { motion } from "framer-motion";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PsychologyIcon from "@mui/icons-material/Psychology";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import Grid from "@mui/material/Grid";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
const MotionBox = motion(Box);

const Home: React.FC = () => {
  const navigate = useNavigate();
    const handleUploadReport = () => {
    navigate("/upload-reports");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#F9F7F7",
        color: "white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Navbar */}
      <NavBar/>

      {/* Hero Section */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          px: 3,
      
        }}
      >
        <MotionBox
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: "bold",
              background: "linear-gradient(to right, #112D4E, #3F72AF, #3F72AF)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Smart Risk Health Analyzer
          </Typography>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <Typography variant="h6" sx={{ mt: 2, maxWidth: "600px", color: "#3F72AF" }}>
            Empowering you with AI-driven insights for better healthcare decisions.
          </Typography>
        </MotionBox>

        <MotionBox whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="contained"
            onClick={handleUploadReport}
            sx={{
              mt: 4,
              px: 4,
              py: 1.5,
              borderRadius: 3,
              fontSize: "1.1rem",
              background: "linear-gradient(to left, #112D4E, #3F72AF)",
              boxShadow: "0px 8px 24px rgba(0,0,0,0.4)",
            }}
          >
            Get Started
          </Button>
        </MotionBox>
      </Box>

      {/* Features Section */}
      <Box id="features" sx={{ py: 8, px: { xs: 3, md: 10 }, background: "#DBE2EF" }}>
        <Grid container spacing={4} justifyContent="center" >
          {[
            {
              icon: <FavoriteIcon fontSize="large" sx={{ color: "#f472b6" }} />,
              title: "AI Risk Prediction",
              desc: "Get personalized health risk assessments powered by AI models.",
            },
            {
              icon: <PsychologyIcon fontSize="large" sx={{ color: "#9333ea" }} />,
              title: "Smart Insights",
              desc: "Understand your reports in plain language with AI-driven analysis.",
            },
            {
              icon: <ShowChartIcon fontSize="large" sx={{ color: "#3b82f6" }} />,
              title: "Track Progress",
              desc: "Monitor your health metrics and improvements over time.",
            },
          ].map((feature) => (
            <Grid >
              <MotionBox whileHover={{ scale: 1.05 }}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 4,
                    background: "F9F7F7",
                    color: "white",
                    boxShadow: "0px 6px 18px rgba(0,0,0,0.3)",
                  }}
                >
                  <CardContent sx={{ textAlign: "center", p: 5, color:"#112D4E" }}>
                    {feature.icon}
                    <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: "bold" }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#3F72AF" }}>
                      {feature.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </MotionBox>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default Home;
