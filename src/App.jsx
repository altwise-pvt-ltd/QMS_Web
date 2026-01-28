import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Auth Imports
import { AuthProvider } from "./auth/AuthContext.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import Login from "./auth/login.jsx";

// Feature Imports
import QMSDashboard from "./features/dashboard/dashboard.jsx";
import DocumentLibrary from "./features/documents/DocumentLibrary.jsx";
import DocumentUploadPage from "./features/documents/component/DocumentUploadPage.jsx";
import DocumentPreviewPage from "./features/documents/component/DocumentPreviewPage.jsx";
import SavedDocumentsPage from "./features/documents/SavedDocumentsPage.jsx";
import NonConformanceForm from "./features/NC/NonConformanceForm.jsx";
import Capa from "./features/capa/capa.jsx";
import StaffModule from "./features/staff/StaffModule.jsx";
import MrmPage from "./features/Management_Review_meeting/MrmPage.jsx";
import QualityIndicator from "./features/qualityindicator/qualityindicator.jsx";
import ComplianceCalendarPage from "./features/compliance_calendar/ComplianceCalendarPage.jsx";
import Department from "./features/department/department.jsx";
import Instrument from "./features/Instrument/Instrument.jsx";
import Training from "./features/training/training.jsx";
import VendorModule from "./features/vendor/vendor.jsx";
import RiskAssessmentPage from "./features/risk_assessment/RiskAssessmentPage.jsx";
import RiskIndicator from "./features/risk_indicator/risk_indicator.jsx";
import EntriesManagement from "./features/entries_management/EntriesManagement.jsx";

// Layout Import
import MainLayout from "./features/layout/MainLayout.jsx";

// Database Initialization
import { initDatabase } from "./db";
import { initializeEventTypes } from "./features/compliance_calendar/services/complianceService";
import { seedComplianceData } from "./features/compliance_calendar/utils/seedData";
import { addExpiryDatesToDocuments } from "./features/compliance_calendar/utils/documentMigration";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Step 1: Safe Open (handles reset on error)
        await initDatabase();

        // Step 2: Seed & Migrate
        await initializeEventTypes();
        await seedComplianceData();
        await addExpiryDatesToDocuments();

        console.log("✅ Application data initialized successfully.");
      } catch (error) {
        console.error("Critical: Database initialization failed", error);
      }
    };
    initializeData();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<QMSDashboard />} />
              <Route path="/staff" element={<StaffModule />} />
              <Route path="/capa" element={<Capa />} />
              <Route path="/mrm" element={<MrmPage />} />
              <Route
                path="/quality-indicators"
                element={<QualityIndicator />}
              />
              <Route path="/compliance" element={<ComplianceCalendarPage />} />
              <Route path="/incidents/new" element={<NonConformanceForm />} />
              <Route path="/department" element={<Department />} />
              <Route path="/intrusment" element={<Instrument />} />
              <Route path="/training" element={<Training />} />
              <Route path="/vendor" element={<VendorModule />} />
              <Route path="/risk-assessment" element={<RiskAssessmentPage />} />
              <Route path="/risk-indicators" element={<RiskIndicator />} />
              <Route
                path="/entries-management"
                element={<EntriesManagement />}
              />

              {/* Documents Routes */}
              <Route path="/documents" element={<DocumentLibrary />} />
              <Route
                path="/documents/upload"
                element={<DocumentUploadPage />}
              />
              <Route path="/documents/saved" element={<SavedDocumentsPage />} />
              <Route path="/documents/view" element={<DocumentPreviewPage />} />
              <Route path="/documents/*" element={<DocumentLibrary />} />
            </Route>

            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
