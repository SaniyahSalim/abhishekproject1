import "./App.css";
import {BrowserRouter as Router , Routes, Route} from "react-router-dom";
import {AuthProvider} from "./ContextApi/Auth";
import UploadReport from "./pages/UploadReport";
import ViewResults from "./pages/ViewResults";
import ViewReports from "./components/ViewReports";
import { CssBaseline } from "@mui/material";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import Home from "./pages/Home";
import About from "./pages/About";
import HeartbeatLoader from "./components/HealthcareLoader";

function App() {
  return (
    <AuthProvider>
    <Router>
      <CssBaseline />
      <div className="App">
        <Routes>
          <Route path="/auth" element={<AuthPage/>} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/load" element={<ProtectedRoute><HeartbeatLoader /></ProtectedRoute>} />
          <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
          <Route path="/upload-reports" element={<ProtectedRoute><UploadReport /></ProtectedRoute>} />
          <Route path="/reports/:patientId" element={<ProtectedRoute><ViewReports /></ProtectedRoute>} />
          <Route path="/results/:patientId/:reportId" element={<ProtectedRoute> <ViewResults/> </ProtectedRoute>} />       
          </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
