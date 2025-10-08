import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@mui/material";

interface ReportResult {
  parameter: string;
  value: number;
  normal_min: number;
  normal_max: number;
  status: string;
}

interface Report {
  report_id: number;
  uploaded_at: string | null;
  results: ReportResult[];
}

// Add this to props
interface PatientHistoryChartsProps {
  patientId: string;
  selectedParameter: string;
}

const PatientHistoryCharts: React.FC<PatientHistoryChartsProps> = ({
  patientId,
  selectedParameter,
}) => {
  const [history, setHistory] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    axios
      .get<Report[]>(`http://localhost:8000/reports/history/${patientId}/results`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setHistory(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching reports:", err);
        setLoading(false);
      });
  }, [patientId]);

  if (loading) {
    return <p className="text-center text-lg">Loading charts...</p>;
  }

  // Filter and transform data for selected parameter only
  const chartData = history
    .map((report, idx) => {
      const param = report.results.find((r) => r.parameter === selectedParameter);
      if (!param) return null;
      return {
        reportId: report.report_id,
        uploaded_at: report.uploaded_at || `Report ${idx + 1}`,
        value: Number(param.value),
        normal_min: param.normal_min,
        normal_max: param.normal_max,
      };
    })
    .filter(Boolean); // Remove nulls

  if (chartData.length === 0) {
    return <p className="text-center text-lg">No data available for {selectedParameter}</p>;
  }

  return (
    <Card className="shadow-lg rounded-2xl">
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-4">{selectedParameter}</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="uploaded_at" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 5 }}
              name="Measured Value"
            />
            <Line
              type="monotone"
              dataKey="normal_min"
              stroke="#82ca9d"
              strokeDasharray="5 5"
              name="Normal Min"
            />
            <Line
              type="monotone"
              dataKey="normal_max"
              stroke="#ff7300"
              strokeDasharray="5 5"
              name="Normal Max"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PatientHistoryCharts;
