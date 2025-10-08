import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import PatientHistoryCharts from "../components/PatientHistoryCharts";
import HealthcareLoader from "../components/HealthcareLoader";

interface ResultProps {
  parameter: string;
  value: string;
  normal_min: number;
  normal_max: number;
  status: string;
}

const ViewResults = () => {
  const { reportId, patientId } = useParams<{
    reportId: string;
    patientId: string;
  }>();

  const [results, setResults] = useState<ResultProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedParameter, setSelectedParameter] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {

     const token = localStorage.getItem("token"); // ✅ get token from localStorage
        if (!token) {
          console.error("No token found. Please log in.");
          navigate("/login"); // redirect if not logged in
          return;
        }

    fetch(`http://127.0.0.1:8000/reports/results/${reportId}`,{method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },})
      .then((response) => response.json())
      .then((data) => {
        setResults(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching results:", error);
        setLoading(false);
      });
  }, [reportId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <HealthcareLoader/>
      </Box>
    );
  }

  return (
    <Box p={1} width="100%" sx={{backgroundColor:"#DBE2EF"}}>
      {/* Header */}
      <Box
        sx={{
          textAlign: "center",
          p: 3,
          borderRadius: 3,
          mb: 4,
          background: "linear-gradient(135deg, #112D4E 0%, #3F72AF 100%)",
          color: "white",
          boxShadow: 4,
          position: "relative",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<ArrowBackIcon />}
          sx={{ position: "absolute", left: 16, top: 16 }}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
        <Typography variant="h4" fontWeight="bold">
          Report Results
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
          Detailed analysis for Report ID: {reportId}
        </Typography>
      </Box>

      {/* Cards Grid */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
        gap={3}
        sx={{backgroundColor:"#F9F7F7"}}
      >
        {results.map((r, idx) => (
          <Card
            key={idx}
            sx={{
              borderRadius: 4,
              boxShadow: 5,
              borderLeft: `6px solid ${
                r.status === "High"
                  ? "#e53935"
                  : r.status === "Low"
                  ? "#fb8c00"
                  : "#43a047"
              }`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              p: 2,
            }}
          >
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                {r.parameter}
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 1 }}>
                Value: <strong>{r.value}</strong>
              </Typography>
              <Typography color="text.secondary">
                Normal Range:{" "}
                <strong>
                  {r.normal_min} – {r.normal_max}
                </strong>
              </Typography>
              <Typography
                sx={{
                  mt: 2,
                  fontWeight: "bold",
                  fontSize: "1rem",
                  color:
                    r.status === "High"
                      ? "error.main"
                      : r.status === "Low"
                      ? "warning.main"
                      : "success.main",
                }}
              >
                Status: {r.status}
              </Typography>

              <Button
                variant="contained"
                sx={{ mt: 2, color: "white", backgroundColor: "#3F72AF"}}
                onClick={() => setSelectedParameter(r.parameter)}
              >
                Analyze
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Modal Dialog for Chart */}
      <Dialog
        open={!!selectedParameter}
        onClose={() => setSelectedParameter(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Analysis for: {selectedParameter}</span>
          <IconButton onClick={() => setSelectedParameter(null)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ height: 350 }}>
            <PatientHistoryCharts
              patientId={patientId || ""}
              selectedParameter={selectedParameter || ""}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ViewResults;
