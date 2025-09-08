import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useAuth } from "../ContextApi/Auth";
import { Link, useNavigate } from "react-router-dom";


interface NavBarProps {
  onUploadReport?: () => void;
  onAbout?: () => void;
  onLogout?: () => void;
}

const NavBar: React.FC<NavBarProps> = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleUploadReport = () => {
    navigate("/upload-reports");
  };
  return (
    <AppBar
      position="sticky"
      sx={{
        background: "#112D4E",
        backdropFilter: "blur(8px)",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo / Brand */}
        <Typography variant="h6" sx={{ fontWeight: "bold", cursor: "pointer" }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          Risk<span style={{ color: "#DBE2EF" }}>Health</span>
          </Link>
        </Typography>

        {/* Nav buttons */}
        <Box>
          <Button color="inherit" onClick={handleUploadReport}>
            Upload Reports
          </Button>
          <Button color="inherit" onClick={() => navigate("/about")}>
            About
          </Button>
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
