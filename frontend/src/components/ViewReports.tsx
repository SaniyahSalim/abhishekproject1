import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from "react-router-dom";

interface Report {
  id: number;
  file_path: string;
  patient_id: number;
  uploaded_at: string | null;
}

const ViewReports: React.FC = () => {
  const { patientId } = useParams(); 
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/reports/patient/${patientId}`);
        if (!res.ok) throw new Error("Failed to fetch reports");
        const data = await res.json();
        setReports(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [patientId]);

  const handleViewResult = (reportId: number) => {
    navigate(`/results/${patientId}/${reportId}`);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "#DBE2EF", minHeight: "100vh" }}>
         <Button
                  variant="contained"
                  color="primary"
                  startIcon={<ArrowBackIcon />}
                  sx={{ position: "absolute", left: 3, top: 25 }}
                  onClick={() => navigate(-1)}
                ></Button>
      <Typography
        variant="h4"
        align="center"
        fontWeight="bold"
        gutterBottom
        sx={{ mb: 3 }}
      >
        Patient Reports
      </Typography>


      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : reports.length === 0 ? (
        <Typography align="center" color="text.secondary">
          No reports available for this patient.
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 4, backgroundColor:"#F9F7F7" }}>
          <Table>
            <TableHead sx={{backgroundColor:"#112D4E"}}>
              <TableRow sx={{ backgroundColor: "#3F72AF" }}>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>File Name</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Uploaded At</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id} hover>
                  <TableCell>{report.id}</TableCell>
                  <TableCell>{report.file_path.split("/").pop()}</TableCell>
                  <TableCell>
                    {report.uploaded_at ? new Date(report.uploaded_at).toLocaleString() : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleViewResult(report.id)}
                      sx={{ borderRadius: 2, fontWeight: "bold",backgroundColor:"#3F72AF" }}
                    >
                      View Result
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ViewReports;
