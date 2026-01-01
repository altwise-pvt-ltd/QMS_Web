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
import DocumentLibrary from "./features/documents/DocumentLibrary.jsx"; // <--- 1. Import Here

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

            {/* 2. Add the Documents Route Here */}
            <Route path="/documents" element={<DocumentLibrary />} />

            {/* Optional: Handle sub-paths if users bookmark them */}
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
