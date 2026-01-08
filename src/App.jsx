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
import CompetenceForm from "./features/training/CompetenceForm.jsx";
import DocumentLibrary from "./features/documents/DocumentLibrary.jsx";
import DocumentUploadPage from "./features/documents/component/DocumentUploadPage.jsx";
import DocumentPreviewPage from "./features/documents/component/DocumentPreviewPage.jsx";
import SavedDocumentsPage from "./features/documents/SavedDocumentsPage.jsx";
import NonConformanceForm from "./features/NC/NonConformanceForm.jsx";
import Capa from "./features/capa/capa.jsx";

// Layout Import
import MainLayout from "./features/layout/MainLayout.jsx";

function App() {
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
              <Route path="/training" element={<CompetenceForm />} />
              <Route path="/capa" element={<Capa />} />
              <Route path="/incidents/new" element={<NonConformanceForm />} />

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

<<<<<<< HEAD
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
=======
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
>>>>>>> 5cc9936dd4c679d2f70c120d1fc627cbbbf0e7f7
  );
}

export default App;
