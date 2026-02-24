# File Tree: QMS_Web

**Generated:** 2/24/2026, 11:45:00 AM
**Root Path:** `c:\Office\Office Projects\QMS_Web`

```
├── docs
│   └── backend
│       └── backend_auth_spec.md
├── public
│   └── vite.svg
├── src
│   ├── assets
│   │   ├── bg_Image
│   │   │   └── bg.jpeg
│   │   ├── defualt_image_placeholder.jpg
│   │   └── logo.png
│   ├── auth
│   │   ├── AuthContext.jsx
│   │   ├── NC_AUTH_STORAGE_REF.md
│   │   ├── ProtectedRoute.jsx
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── login.css
│   │   ├── login.jsx
│   │   └── walkthrough.md
│   ├── components
│   │   └── ui
│   │       ├── CircularLoading.jsx
│   │       ├── CustomPagination.jsx
│   │       ├── ImageWithFallback.jsx
│   │       ├── Skeleton.jsx
│   │       └── Spinner.jsx
│   ├── data
│   │   ├── Document
│   │   │   ├── QualityManual_V1.pdf
│   │   │   ├── QualityManual_V2.pdf
│   │   │   └── QualityManual_V3.pdf
│   │   └── jsonData
│   │       └── MOCK_DATA.js
│   ├── db
│   │   ├── dummyUSerData.js
│   │   └── index.js
│   ├── features
│   │   ├── Instrument
│   │   │   ├── components
│   │   │   │   ├── Instrument_list.jsx
│   │   │   │   └── Instrumentform.jsx
│   │   │   ├── services
│   │   │   │   └── instrumentService.js
│   │   │   └── Instrument.jsx
│   │   ├── Management_Review_meeting
│   │   │   ├── components
│   │   │   │   ├── AttendanceSelection.jsx
│   │   │   │   ├── MeetingViewModal.jsx
│   │   │   │   ├── MinutesOfMeeting.jsx
│   │   │   │   ├── MinutesOfMeetingPreview.jsx
│   │   │   │   ├── MrmList.jsx
│   │   │   │   ├── MrmPdfView.jsx
│   │   │   │   ├── MrmWorkflow.jsx
│   │   │   │   └── PdfExportButtons.jsx
│   │   │   ├── hooks
│   │   │   │   └── useMrm.js
│   │   │   ├── pages
│   │   │   │   ├── ActionItemsPage.jsx
│   │   │   │   └── CreateMeetingPage.jsx
│   │   │   ├── pdf Creations
│   │   │   │   ├── MRMPdf.jsx
│   │   │   │   └── MinutesOfMeetingPdf.jsx
│   │   │   ├── services
│   │   │   │   └── mrmService.js
│   │   │   ├── utils
│   │   │   │   ├── pdfUtils.jsx
│   │   │   │   └── seedData.js
│   │   │   └── MrmPage.jsx
│   │   ├── NC
│   │   │   ├── components
│   │   │   │   ├── NCActions.jsx
│   │   │   │   ├── NCDetailsModal.jsx
│   │   │   │   ├── NCEntry.jsx
│   │   │   │   ├── NCHeader.jsx
│   │   │   │   └── NCHistoryTable.jsx
│   │   │   ├── data
│   │   │   │   └── NcCategories.js
│   │   │   ├── services
│   │   │   │   └── ncService.js
│   │   │   ├── NonConformanceForm.jsx
│   │   │   ├── README.md
│   │   │   └── Walkthrough.md
│   │   ├── capa
│   │   │   ├── components
│   │   │   │   ├── capaform.jsx
│   │   │   │   └── formpreview.jsx
│   │   │   ├── services
│   │   │   │   └── capaService.js
│   │   │   ├── CAPAFormView.jsx
│   │   │   ├── capa.jsx
│   │   │   ├── data.js
│   │   │   └── quedata.js
│   │   ├── compliance_calendar
│   │   │   ├── components
│   │   │   │   ├── ComplianceDashboard.jsx
│   │   │   │   ├── DocumentList.jsx
│   │   │   │   ├── DocumentViewModal.jsx
│   │   │   │   ├── EventCalendar.jsx
│   │   │   │   ├── EventForm.jsx
│   │   │   │   └── EventList.jsx
│   │   │   ├── config
│   │   │   │   └── eventTypes.js
│   │   │   ├── services
│   │   │   │   └── complianceService.js
│   │   │   ├── utils
│   │   │   │   ├── documentMigration.js
│   │   │   │   ├── reminderUtils.js
│   │   │   │   └── seedData.js
│   │   │   └── ComplianceCalendarPage.jsx
│   │   ├── dashboard
│   │   │   ├── forms
│   │   │   │   └── employee_form.jsx
│   │   │   ├── services
│   │   │   │   └── taskWidgetService.js
│   │   │   ├── utils
│   │   │   │   └── BentoCard.jsx
│   │   │   ├── widgets
│   │   │   │   ├── ActivityFeedWidget.jsx
│   │   │   │   ├── AuditReadinessWidget.jsx
│   │   │   │   ├── CapaChartWidget.jsx
│   │   │   │   ├── DeviationsWidget.jsx
│   │   │   │   ├── DocumentStatusWidget.jsx
│   │   │   │   ├── HealthScoreWidget.jsx
│   │   │   │   ├── NextAuditWidget.jsx
│   │   │   │   ├── RiskWidget.jsx
│   │   │   │   ├── SupplierQualityWidget.jsx
│   │   │   │   ├── TaskListWidget.jsx
│   │   │   │   └── TrainingComplianceWidget.jsx
│   │   │   └── dashboard.jsx
│   │   ├── department
│   │   │   ├── component
│   │   │   │   ├── add_department.jsx
│   │   │   │   ├── department_cards.jsx
│   │   │   │   └── department_view.jsx
│   │   │   ├── services
│   │   │   │   └── departmentService.js
│   │   │   ├── department.jsx
│   │   │   └── emp_data.js
│   │   ├── documents
│   │   │   ├── component
│   │   │   │   ├── DocumentPreviewPage.jsx
│   │   │   │   ├── DocumentUploadForm.jsx
│   │   │   │   ├── DocumentUploadPage.jsx
│   │   │   │   ├── SavedDocumentsTable.jsx
│   │   │   │   └── UploadPreviewModal.jsx
│   │   │   ├── services
│   │   │   │   ├── documentService.js
│   │   │   │   └── documentTransformer.js
│   │   │   ├── DocumentLibrary.jsx
│   │   │   ├── SavedDocumentsPage.jsx
│   │   │   └── data.js
│   │   ├── entries_management
│   │   │   ├── components
│   │   │   │   ├── DataFeedForm.jsx
│   │   │   │   ├── EntryForm.jsx
│   │   │   │   ├── EntryList.jsx
│   │   │   │   ├── LabDetail.jsx
│   │   │   │   ├── LabForm.jsx
│   │   │   │   ├── LabList.jsx
│   │   │   │   └── ReceptionLog.jsx
│   │   │   ├── data
│   │   │   │   └── entriesData.js
│   │   │   └── EntriesManagement.jsx
│   │   ├── layout
│   │   │   └── MainLayout.jsx
│   │   ├── onboarding
│   │   │   ├── services
│   │   │   │   └── organizationService.js
│   │   │   ├── OnboardingPage.jsx
│   │   │   └── onboarding.css
│   │   ├── qualityindicator
│   │   │   ├── components
│   │   │   │   ├── QIFormFooter.jsx
│   │   │   │   ├── QIFormHeader.jsx
│   │   │   │   ├── QIFormSidebar.jsx
│   │   │   │   └── QIReportTable.jsx
│   │   │   ├── qalityindicatorform.jsx
│   │   │   ├── qi_data.js
│   │   │   └── qualityindicator.jsx
│   │   ├── risk_assessment
│   │   │   ├── components
│   │   │   │   ├── RiskDateFilter.jsx
│   │   │   │   ├── RiskDetailPanel.jsx
│   │   │   │   ├── RiskMatrix.jsx
│   │   │   │   ├── RiskSummary.jsx
│   │   │   │   └── RiskTable.jsx
│   │   │   ├── services
│   │   │   │   └── riskService.js
│   │   │   └── RiskAssessmentPage.jsx
│   │   ├── risk_indicator
│   │   │   ├── components
│   │   │   │   ├── RIFormFooter.jsx
│   │   │   │   ├── RIFormHeader.jsx
│   │   │   │   ├── RIFormSidebar.jsx
│   │   │   │   └── RIReportTable.jsx
│   │   │   ├── services
│   │   │   │   └── riService.js
│   │   │   ├── risk_indicator.jsx
│   │   │   ├── risk_indicator_data.js
│   │   │   └── risk_indicator_form.jsx
│   │   ├── sidebarComponent
│   │   │   ├── sidebar.jsx
│   │   │   └── sidebarConfig.js
│   │   ├── staff
│   │   │   ├── components
│   │   │   │   ├── CompetenceFormComponents
│   │   │   │   │   ├── AssessmentValidation.jsx
│   │   │   │   │   ├── BaselineQualifications.jsx
│   │   │   │   │   ├── EmployeeIdentification.jsx
│   │   │   │   │   ├── FormActions.jsx
│   │   │   │   │   ├── FormHeader.jsx
│   │   │   │   │   ├── SkillsMatrix.jsx
│   │   │   │   │   ├── TrainingCertifications.jsx
│   │   │   │   │   └── index.js
│   │   │   │   ├── EmployeeDocumentsComponents
│   │   │   │   │   ├── AppointmentDocuments.jsx
│   │   │   │   │   ├── DocumentFormActions.jsx
│   │   │   │   │   ├── DocumentFormHeader.jsx
│   │   │   │   │   ├── MedicalRecords.jsx
│   │   │   │   │   ├── PersonalDocuments.jsx
│   │   │   │   │   ├── QualificationDocuments.jsx
│   │   │   │   │   ├── TrainingRecords.jsx
│   │   │   │   │   ├── VaccinationRecords.jsx
│   │   │   │   │   └── index.js
│   │   │   │   ├── CompetenceForm.jsx
│   │   │   │   ├── CreateStaffForm.jsx
│   │   │   │   ├── EmployeeDocumentsForm.jsx
│   │   │   │   ├── PermissionsPage.jsx
│   │   │   │   ├── StaffDocuments.jsx
│   │   │   │   └── StaffList.jsx
│   │   │   ├── services
│   │   │   │   └── staffService.js
│   │   │   └── StaffModule.jsx
│   │   ├── training
│   │   │   ├── components
│   │   │   │   ├── Calendar
│   │   │   │   │   └── components
│   │   │   │   │       ├── Action.jsx
│   │   │   │   │       ├── calendar.jsx
│   │   │   │   │       └── title.jsx
│   │   │   │   ├── CustomCalendar.jsx
│   │   │   │   ├── ScheduleTrainingModal.jsx
│   │   │   │   ├── TrainingMatrix.jsx
│   │   │   │   ├── YearlyTrainingPdfView.jsx
│   │   │   │   └── YearlyTrainingPreview.jsx
│   │   │   ├── pdf Creations
│   │   │   │   └── YearlySchedulePdf.jsx
│   │   │   └── training.jsx
│   │   └── vendor
│   │       ├── services
│   │       │   └── vendorService.js
│   │       ├── utils
│   │       │   ├── constants.js
│   │       │   ├── vendorMapper.js
│   │       │   └── vendorValidation.js
│   │       ├── VendorForm.jsx
│   │       ├── VendorList.jsx
│   │       ├── VendorView.jsx
│   │       ├── vendor.css
│   │       └── vendor.jsx
│   ├── services
│   │   ├── alert
│   │   │   ├── component
│   │   │   │   └── alert.jsx
│   │   │   ├── AlertProvider.jsx
│   │   │   ├── README.md
│   │   │   └── alertService.js
│   │   ├── documentService.js
│   │   └── ncService.js
│   ├── store
│   │   ├── slices
│   │   │   └── authSlice.js
│   │   └── index.js
│   ├── utils
│   │   ├── errorHandler.js
│   │   └── imageUtils.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── Document_Flow_Guide.md
├── PROJECT_PROGRESS.md
├── README.md
├── Theoretical_Flow.md
├── WORK_LOG_JAN_2026.md
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── vercel.json
└── vite.config.js
```

---
*Generated by FileTree Pro Extension*