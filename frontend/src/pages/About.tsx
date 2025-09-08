import React from "react";
import { Typography, Box, Card, CardContent } from "@mui/material";
import { motion } from "framer-motion";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PsychologyIcon from "@mui/icons-material/Psychology";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import Grid from "@mui/material/Grid";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
const MotionBox = motion(Box);

const About: React.FC = () => {
  return (
    <>
        <NavBar />
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #112D4E, #3F72AF, #3F72AF)",
        color: "white",
        display: "flex",
        alignItems: "center",
        py: 8,
      }}
    >
      {/* Features Section */}
      <Box
        id="features"
        sx={{ py: 8, px: { xs: 3, md: 10 }, background: "#DBE2EF" }}
      >
        <Typography
          variant="h3"
          align="center"
          sx={{ fontWeight: "bold", mb: 3 }}
        >
          About{" "}
          <span style={{ color: "#3F72AF" }}>Smart Healthcare Analyzer</span>
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {[
            {
              icon: <FavoriteIcon fontSize="large" sx={{ color: "#f472b6" }} />,
              title: "AI Risk Prediction",
              desc: "Get personalized health risk assessments powered by AI models.",
            },
            {
              icon: (
                <PsychologyIcon fontSize="large" sx={{ color: "#9333ea" }} />
              ),
              title: "Smart Insights",
              desc: "Understand your reports in plain language with AI-driven analysis.",
            },
            {
              icon: (
                <ShowChartIcon fontSize="large" sx={{ color: "#3b82f6" }} />
              ),
              title: "Track Progress",
              desc: "Monitor your health metrics and improvements over time.",
            },
          ].map((feature) => (
            <Grid>
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
                  <CardContent
                    sx={{ textAlign: "center", p: 5, color: "#112D4E" }}
                  >
                    {feature.icon}
                    <Typography
                      variant="h6"
                      sx={{ mt: 2, mb: 1, fontWeight: "bold" }}
                    >
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
    </Box>
    <Footer />
    </>
  );
};

export default About;
