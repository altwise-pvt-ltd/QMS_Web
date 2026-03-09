# Application Flow: Staff User Guide

This document outlines the user journey and system behavior for a **Staff** user within the QMS (Quality Management System) Web application.

## 1. Authentication & Onboarding

### Login Flow
- **Entry Point**: `/login`
- **Process**:
  1. Staff enters email and password.
  2. `authService.loginUser` validates credentials.
  3. `getProfile` fetches user details, including the `role` (Staff) and `organizationId`.
  4. Redux state is updated with user credentials.
- **Auto-Redirection**:
  - If a staff member belongs to an organization, they are directed to `/dashboard`.
  - If no organization is linked (rare for staff), they may be sent to `/onboarding`.

### Protected Access
- **Guard**: `ProtectedRoute.jsx` ensures only authenticated users can access internal routes.
- **Session Management**: Tokens are stored in `localStorage` and synchronized across tabs.

---

## 2. Navigation (Sidebar)

The sidebar items are dynamically filtered based on the user's role and assigned permissions.

### Visibility Control
- **Logic**: `sidebar.jsx` uses `filteredSidebarItems` to match `user.role` against required roles in `sidebarConfig.js`.
- **Default Sidebar Items**:
  - Dashboard
  - Documents
  - CAPA & Incidents
  - Entries Management
  - Compliance Calendar
  - Management Review
  - Staff (Viewing only)
  - Quality Indicators
  - Risk Indicators
  - Training
  - Department
  - Instrument Calibration
  - Vendor Management
  - Risk Assessment

---

## 3. Dashboard Experience

The dashboard (`/dashboard`) provides a high-level overview of quality metrics.

- **Widgets**: Staff can see widgets like *Overall Health*, *Training*, *My Tasks*, and *Incident Trends*.
- **Actions**:
  - **New Incident**: Staff can initiate a Non-Conformance report directly from the dashboard.
  - **Date Filters**: Adjust visualization ranges.

---

## 4. Module-Level Permissions

The application uses a granular permission system defined in `permision_data.js`. Admins can enable/disable specific capabilities for each staff member.

### Common Staff Actions
- **Non-Conformance (NC)**:
  - Create new NC reports (`/incidents/new`).
  - View NC history.
  - Tag other staff in incidents.
- **Documents**:
  - View and download permitted documents.
  - Upload evidence for NCs or compliance events.
- **Compliance Calendar**:
  - View upcoming events and deadlines.
  - Update status of assigned tasks.
- **Staff Module**:
  - **View Only**: Staff can typically see the directory but cannot create or edit other staff profiles unless specifically permitted.
  - **Competence**: View their own competence status and associated documents.

---

## 5. Permission Management (Admin Controlled)

Staff members **cannot** manage their own or others' permissions. This is handled by **Admins** via the `PermissionsPage.jsx` component.

- **Modules Controlled**: Instrument, MRM, NC, CAPA, Compliance, Dashboard, Department, Documents, Staff, Vendor.
- **Granular Rights**: View, Edit, Delete, Create, and specialized actions (e.g., PDF View, Status Update).

## 6. Feature Mapping (Files & Tasks)

To help understand the implementation, here is a mapping of key files and the tasks they handle for the Staff role.

### 🔐 Authentication & Global State
| File Name | Task / Responsibility |
| :--- | :--- |
| `src/auth/login.jsx` | User login interface and initial authentication logic. |
| `src/auth/authService.js` | API communication for Login, Logout, and Profile fetching. |
| `src/auth/AuthContext.jsx`| Managing global `user` and `organization` state. |
| `src/auth/ProtectedRoute.jsx` | Redirecting unauthenticated users or those without an organization. |

### 📊 Dashboard (Overview)
| File Name | Task / Responsibility |
| :--- | :--- |
| `src/features/dashboard/dashboard.jsx` | Main layout for the "Quality Overview" page. |
| `src/features/dashboard/widgets/` | Individual widgets (`TaskListWidget`, `HealthScoreWidget`, `ActivityFeedWidget`). |
| `src/features/dashboard/utils/BentoCard.jsx` | Container component for all dashboard widgets. |

### 🚨 Non-Conformance (NC)
| File Name | Task / Responsibility |
| :--- | :--- |
| `src/features/NC/NonConformanceForm.jsx` | The main form used by staff to report new incidents. |
| `src/features/NC/components/NCEntry.jsx` | UI for adding/editing individual incident entries. |
| `src/features/NC/components/NCHistoryTable.jsx` | Displaying the log of past incidents created by the user. |
| `src/features/NC/services/ncService.js` | API calls for creating, fetching, and updating NC records. |

### 🛠️ CAPA (Corrective & Preventive Action)
| File Name | Task / Responsibility |
| :--- | :--- |
| `src/features/capa/capa.jsx` | Dashboard view for all active and pending CAPA items. |
| `src/features/capa/components/capaform.jsx` | Complex form for documenting corrective and preventive actions. |
| `src/features/capa/CAPAFormView.jsx` | Read-only view and PDF generation for CAPA reports. |

### 🧪 Entries Management (Lab Data)
| File Name | Task / Responsibility |
| :--- | :--- |
| `src/features/entries_management/EntriesManagement.jsx` | Entry point for managing lab tests and logs. |
| `src/features/entries_management/components/EntryForm.jsx` | Main form for staff to enter test data/results. |
| `src/features/entries_management/components/ReceptionLog.jsx` | Logging and tracking incoming samples for testing. |
| `src/features/entries_management/components/LabList.jsx` | Viewing authorized labs and their status. |

### 📅 Compliance Calendar
| File Name | Task / Responsibility |
| :--- | :--- |
| `src/features/compliance_calendar/ComplianceCalendarPage.jsx` | Main calendar interface for tracking deadlines. |
| `src/features/compliance_calendar/components/EventForm.jsx` | Creating or updating compliance-related events. |
| `src/features/compliance_calendar/components/ComplianceDashboard.jsx` | Summary view of compliance metrics and upcoming tasks. |

### 📂 Documents & Library
| File Name | Task / Responsibility |
| :--- | :--- |
| `src/features/documents/DocumentLibrary.jsx` | Browsing and searching the organization's document repository. |
| `src/features/documents/component/DocumentUploadPage.jsx` | System for uploading and categorizing new documents. |
| `src/features/documents/SavedDocumentsPage.jsx` | User-specific view for bookmarked or frequently used documents. |

---

## 7. Summary of Role Differences

| Feature | Admin | Staff |
| :--- | :--- | :--- |
| **User Management** | Full Control (Create/Edit/Permissions) | View Only (Limited) |
| **System Settings** | Full Access | No Access |
| **Data Entry** | Full Access | Assigned Modules Only |
| **Audit/Review** | Full Control | Participant/Viewer |

> [!NOTE]
> The exact experience of a staff member depends on the toggles set by the Administrator in the "Permissions" tab of their staff profile.
