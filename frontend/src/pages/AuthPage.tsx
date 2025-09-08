import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import loginImage from "../assets/loginImage.png";
import { Email, Lock, Person } from "@mui/icons-material";
import { useAuth } from "../ContextApi/Auth";
import { useNavigate } from "react-router-dom";

const AuthPage: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  // ✅ Notification state
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  const showNotification = (
    message: string,
    severity: "success" | "error" | "warning" | "info"
  ) => {
    setNotification({ open: true, message, severity });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (type: "login" | "signup") => {
    if (type === "login") {
      const { email, password } = form;
      if (!email || !password) {
        showNotification("⚠️ Please enter both email and password.", "warning");
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const data = await response.json();
          login(data.access_token);
          showNotification("✅ Login successful!", "success");
          setTimeout(()=>navigate("/"),1800);
          ;
        } else {
          const err = await response.json();
          showNotification(err.detail || "❌ Login failed", "error");
        }
      } catch (error) {
        console.error("Error during login:", error);
        showNotification("⚠️ Error connecting to server.", "error");
      }
    } else {
      const { name, email, password } = form;
      if (!name) {
        showNotification("⚠️ Please enter your name.", "warning");
        return;
      }
      if (!email || !password) {
        showNotification("⚠️ Please enter both email and password.", "warning");
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        });

        if (response.ok) {
          await response.json();
          showNotification("✅ Signup successful! Please login.", "success");
          setTimeout(() => setTab(0), 1500);
          
        } else {
          const err = await response.json();
          showNotification(err.detail || "❌ Signup failed", "error");
        }
      } catch (error) {
        console.error("Error during signup:", error);
        showNotification("⚠️ Error connecting to server.", "error");
      }
    }
  };

  return (
    <Box
      display="flex"
      minHeight="100vh"
      sx={{ background: "linear-gradient(to right,rgb(26, 123, 241) , #F9F7F7)" }}
    >
      {/* Left Section with Illustration */}
      <Box
        flex={1}
        display={{ xs: "none", md: "flex" }}
        alignItems="center"
        justifyContent="center"
        sx={{
          background:
            "linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(255,255,255,0.05))",
          color: "white",
          p: 6,
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <img
          src={loginImage}
          alt="Healthcare Illustration"
          style={{ width: "70%", marginBottom: "30px" }}
        />
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Smart Healthcare Analyzer
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 400 }}>
          Analyze patient data, track health reports, and make smarter healthcare
          decisions with AI-powered insights.
        </Typography>
      </Box>

      {/* Right Section with Auth Card */}
      <Box flex={1} display="flex" alignItems="center" justifyContent="center" p={3}>
        <Card
          sx={{
            width: 420,
            borderRadius: 4,
            boxShadow: "0px 8px 24px rgba(0,0,0,0.2)",
            backgroundColor: "white",
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              textAlign="center"
              fontWeight="bold"
              mb={2}
              sx={{ color: "#2575fc" }}
            >
              {tab === 0 ? "Welcome Back 👋" : "Join SmartCare ✨"}
            </Typography>

            <Tabs
              value={tab}
              onChange={(_, newValue) => setTab(newValue)}
              variant="fullWidth"
              sx={{ mb: 2 }}
            >
              <Tab label="Login" />
              <Tab label="Signup" />
            </Tabs>

            <Box mt={2}>
              {tab === 1 && (
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  variant="outlined"
                  margin="normal"
                  value={form.name}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                />
              )}

              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                variant="outlined"
                margin="normal"
                value={form.email}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                variant="outlined"
                margin="normal"
                value={form.password}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  py: 1.4,
                  borderRadius: 3,
                  fontSize: "16px",
                  textTransform: "none",
                  background: "#3F72AF",
                  "&:hover": {
                    background: "#CBE6FB",
                    color: "black",
                  },
                }}
                onClick={() => handleSubmit(tab === 0 ? "login" : "signup")}
              >
                {tab === 0 ? "Login" : "Signup"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* ✅ Snackbar Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AuthPage;
