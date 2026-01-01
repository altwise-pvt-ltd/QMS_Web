import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Feature Imports
import Login from "./auth/login.jsx";
import QMSDashboard from "./features/dashboard/dashboard.jsx";
import CompetenceForm from "./features/training/CompetenceForm.jsx";
import DocumentLibrary from "./features/documents/DocumentLibrary.jsx";
import DocumentUploadPage from "./features/documents/component/DocumentUploadPage.jsx";

// Layout Import
import MainLayout from "./features/layout/MainLayout.jsx";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<QMSDashboard />} />
            <Route path="/training" element={<CompetenceForm />} />

            {/* Documents Routes - IMPORTANT: /upload must come before /* catch-all */}
            <Route path="/documents" element={<DocumentLibrary />} />
            <Route path="/documents/upload" element={<DocumentUploadPage />} />
            <Route path="/documents/*" element={<DocumentLibrary />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
