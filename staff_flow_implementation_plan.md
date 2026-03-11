# Implementation Plan - Staff Flow UI

Create a unified, step-by-step wizard for managing staff members, supporting both **Admin/Manager setup** and **Staff Self-Service onboarding**.

## User Review Required

> [!IMPORTANT]
> The "Staff Flow" will serve two purposes:
> 1. **Manager Mode**: Used by admins to set up or update any staff member's records.
> 2. **Staff Mode**: A "Self-Service" version where individuals can complete their own profile, competence data, and document uploads.
> 
> **Access Control**: In "Staff Mode", certain fields (like Department, Job Title, Permissions) will be read-only to prevent unauthorized changes.

## Proposed Changes

### Staff Feature

#### [NEW] [StaffFlow.jsx](file:///c:/Office/Office%20Projects/QMS_Web/src/features/staff/components/StaffFlow.jsx)
A unified wizard component supporting `mode="admin"` and `mode="staff"`.
- **Steps**:
  1. **Basic Info**: Profile details (Read-only for staff).
  2. **Competence**: Skills, Experience, Qualifications.
  3. **Documents**: CV, ID, Medical, etc.
  4. **Verification**: Final review and submission.
- **Role-based Logic**: Hides "Permissions" step for staff users.

#### [MODIFY] [StaffModule.jsx](file:///c:/Office/Office%20Projects/QMS_Web/src/features/staff/StaffModule.jsx)
- Update entry points to launch `StaffFlow` in `admin` mode when managing others.

#### [NEW] [MyProfileFlow.jsx](file:///c:/Office/Office%20Projects/QMS_Web/src/features/staff/components/MyProfileFlow.jsx)
- A wrapper component for staff members to access their personal `StaffFlow`.
- Automatically fetches the `staffId` associated with the logged-in user profile.

#### [MODIFY] [QMSDashboard.jsx](file:///c:/Office/Office%20Projects/QMS_Web/src/features/dashboard/dashboard.jsx)
- Add a conditional "Complete Your Profile" bento card for non-admin users.

## Verification Plan

### Manual Verification
1. **Manager Setup**: Login as Admin, click "Add New Staff", complete the wizard. Verify all data is saved.
2. **Staff Onboarding**: Login as Staff, click "Complete Profile", verify only allowed fields are editable.
3. **Data Integrity**: Ensure documents uploaded by Staff appear correctly in the Manager's staff directory.
