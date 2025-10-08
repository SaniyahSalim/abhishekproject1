import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  CardActions,
  Box,
  Stack,
  Tabs,
  Tab,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Container,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  CloudUpload,
  FolderOpen,
  Edit,
  Delete,
  PersonAdd,
  Save,
  Close,
} from "@mui/icons-material";
import NavBar from "../components/NavBar";
import patient_management_image from "../assets/patient_management.webp";
import HeartbeatLoader from "../components/HealthcareLoader";

const API_BASE = "http://127.0.0.1:8000"; // your FastAPI backend

const UploadReport: React.FC = () => {
  const [tab, setTab] = useState(0);

  // Upload states
  const [file, setFile] = useState<File | null>(null);
  const [patientId, setPatientId] = useState<string>("");

  // Patient states
  const [patients, setPatients] = useState<any[]>([]);
  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    gender: "",
    email: "",
  });

  // Editing states
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});

  // Loading and navigation
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Snackbar notifications
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({ open: false, message: "", severity: "info" });

  const showNotification = (
    message: string,
    severity: "success" | "error" | "warning" | "info"
  ) => {
    setNotification({ open: true, message, severity });
  };

  // Get JWT token from localStorage
  const token = localStorage.getItem("token");

  // Fetch all patients on load
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/patients/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Unauthorized or failed");

      const data = await res.json();
      setPatients(data);
    } catch (err) {
      console.error("Failed to fetch patients:", err);
      showNotification("Failed to fetch patients", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !patientId) {
      showNotification("Please provide both Patient ID and a file.", "warning");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/reports/upload/${patientId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        showNotification("Report uploaded successfully!", "success");
        setFile(null);
        setPatientId("");
      } else {
        showNotification("Failed to upload report.", "error");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      showNotification("Error uploading file", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleViewReports = () => {
    if (!patientId) {
      showNotification("Please enter a Patient ID first.", "warning");
      return;
    }
    navigate(`/reports/${patientId}`);
  };

  const handleAddPatient = async () => {
    if (!newPatient.name || !newPatient.gender || !newPatient.age || !newPatient.email) {
      showNotification("Fill all patient fields.", "warning");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/patients/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPatient),
      });

      if (res.ok) {
        showNotification("Patient added!", "success");
        setNewPatient({ name: "", gender: "", age: "", email: "" });
        await fetchPatients();
      } else {
        showNotification("Failed to add patient.", "error");
      }
    } catch (err) {
      console.error("Error adding patient:", err);
      showNotification("Error adding patient", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePatient = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/patients/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        showNotification("Patient deleted.", "success");
        await fetchPatients();
      } else {
        showNotification("Failed to delete patient.", "error");
      }
    } catch (err) {
      console.error("Error deleting patient:", err);
      showNotification("Error deleting patient", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditPatient = (patient: any) => {
    setEditId(patient.id);
    setEditData({ ...patient });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditData({});
  };

  const handleSaveEdit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/patients/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });

      if (res.ok) {
        showNotification("Patient updated!", "success");
        setEditId(null);
        setEditData({});
        await fetchPatients();
      } else {
        showNotification("Failed to update patient.", "error");
      }
    } catch (err) {
      console.error("Error updating patient:", err);
      showNotification("Error updating patient", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f8fafc, #DBE2EF)",
          py: 2,
          position: "relative",
        }}
      >
        {loading && <HeartbeatLoader />}

        <Paper square elevation={3} sx={{ borderRadius: 0, background: "#ffffffdd", mb: 2 }}>
          <Tabs
            value={tab}
            onChange={(_, val) => setTab(val)}
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Upload Report" sx={{ fontWeight: "bold" }} />
            <Tab label="Manage Patients" sx={{ fontWeight: "bold" }} />
          </Tabs>
        </Paper>

        <Container maxWidth="xl">
          {tab === 0 && (
            <Card sx={{ width: "100%", borderRadius: 4, boxShadow: 4, p: 4 }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/2966/2966489.png"
                    alt="Medical Report"
                    width={100}
                    height={100}
                    style={{ borderRadius: "50%" }}
                  />
                </Box>
                <Typography variant="h4" fontWeight="bold" color="#3F72AF" gutterBottom textAlign="center">
                  Upload Medical Report
                </Typography>

                <TextField
                  label="Patient ID"
                  variant="outlined"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  fullWidth
                  margin="normal"
                />

                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{
                    mt: 2,
                    borderRadius: 3,
                    py: 1.4,
                    fontWeight: "bold",
                    borderColor: "#1976d2",
                    color: "#3F72AF",
                    "&:hover": { background: "#e3f2fd" },
                  }}
                >
                  {file ? (
                    <>
                      <FolderOpen sx={{ mr: 1, color: "#3F72AF" }} /> {file.name}
                    </>
                  ) : (
                    <>
                      <CloudUpload sx={{ mr: 1 }} /> Choose File
                    </>
                  )}
                  <input type="file" accept=".pdf" hidden onChange={handleFileChange} />
                </Button>

                <CardActions sx={{ justifyContent: "center", mt: 3 }}>
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleUpload}
                      disabled={!file || !patientId}
                      sx={{ px: 4, py: 1.3, borderRadius: 3, fontWeight: "bold", boxShadow: 3, background: "#3F72AF" }}
                    >
                      Upload
                    </Button>

                    <Button
                      onClick={handleViewReports}
                      disabled={!patientId}
                      sx={{ px: 3, py: 1.3, borderRadius: 3, color: "black", border: "2px solid #3F72AF" }}
                    >
                      View Reports
                    </Button>
                  </Stack>
                </CardActions>
              </CardContent>
            </Card>
          )}

          {tab === 1 && (
            <Card sx={{ width: "100%", borderRadius: 4, boxShadow: 4, p: 4 }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                  <img
                    src={patient_management_image}
                    alt="Patient Management"
                    width={100}
                    height={100}
                    style={{ borderRadius: "50%" }}
                  />
                </Box>

                <Typography variant="h4" fontWeight="bold" color="#3F72AF" gutterBottom textAlign="center">
                  Patient Management
                </Typography>

                {/* Add patient */}
                <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 3 }}>
                  <TextField
                    label="Name"
                    variant="outlined"
                    value={newPatient.name}
                    onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                    fullWidth
                  />
                  <TextField
                    label="Age"
                    variant="outlined"
                    value={newPatient.age}
                    onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                    fullWidth
                  />
                  <TextField
                    label="Gender"
                    variant="outlined"
                    value={newPatient.gender}
                    onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                    fullWidth
                  />
                  <TextField
                    label="Email"
                    variant="outlined"
                    value={newPatient.email}
                    onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                    fullWidth
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddPatient}
                    startIcon={<PersonAdd />}
                    sx={{ borderRadius: 3, fontWeight: "bold", px: 4, backgroundColor: "#3F72AF" }}
                  >
                    Add
                  </Button>
                </Stack>

                {/* Patient Table */}
                <Paper sx={{ width: "100%", overflowX: "auto", boxShadow: 3, borderRadius: 3 }}>
                  <Table>
                    <TableHead sx={{ background: "#f1f5f9" }}>
                      <TableRow>
                        <TableCell><b>PID</b></TableCell>
                        <TableCell><b>Name</b></TableCell>
                        <TableCell><b>Age</b></TableCell>
                        <TableCell><b>Gender</b></TableCell>
                        <TableCell><b>Email</b></TableCell>
                        <TableCell align="right"><b>Actions</b></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {patients.map((p) => (
                        <TableRow key={p.id} hover>
                          <TableCell>{editId === p.id ? <TextField value={editId} onChange={(e) => setEditData({ ...editData, id: e.target.value })} size="small" /> : p.id}</TableCell>
                          <TableCell>{editId === p.id ? <TextField value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} size="small" /> : p.name}</TableCell>
                          <TableCell>{editId === p.id ? <TextField value={editData.age} onChange={(e) => setEditData({ ...editData, age: e.target.value })} size="small" /> : p.age}</TableCell>
                          <TableCell>{editId === p.id ? <TextField value={editData.gender} onChange={(e) => setEditData({ ...editData, gender: e.target.value })} size="small" /> : p.gender}</TableCell>
                          <TableCell>{editId === p.id ? <TextField value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} size="small" /> : p.email}</TableCell>
                          <TableCell align="right">
                            {editId === p.id ? (
                              <>
                                <IconButton color="success" onClick={handleSaveEdit}><Save /></IconButton>
                                <IconButton color="error" onClick={handleCancelEdit}><Close /></IconButton>
                              </>
                            ) : (
                              <>
                                <IconButton onClick={() => handleEditPatient(p)} sx={{ color: "#3F72AF" }}><Edit /></IconButton>
                                <IconButton color="error" onClick={() => handleDeletePatient(p.id)}><Delete /></IconButton>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      {patients.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} align="center">No patients added yet.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Paper>
              </CardContent>
            </Card>
          )}
        </Container>

        {/* Snackbar */}
        <Snackbar
          open={notification.open}
          autoHideDuration={3000}
          onClose={() => setNotification({ ...notification, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
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
    </>
  );
};

export default UploadReport;
