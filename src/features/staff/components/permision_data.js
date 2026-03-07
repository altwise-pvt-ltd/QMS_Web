export const PERMISSION_DATA = {
    "permissions": [
        {
            "key": "dashboard",
            "name": "Dashboard",
            "enabled": false,
            "features": [
                { "key": "activity_feed", "name": "Activity Feed Widget", "enabled": false },
                { "key": "audit_readiness", "name": "Audit Readiness Widget", "enabled": false },
                { "key": "capa_chart", "name": "CAPA Chart Widget", "enabled": false },
                { "key": "risk_widget", "name": "Risk Widget", "enabled": false }
            ]
        },
        {
            "key": "instrument",
            "name": "Instrument",
            "enabled": false,
            "features": [
                { "key": "instrument_list_view", "name": "Instrument List - View", "enabled": false },
                { "key": "instrument_list_edit", "name": "Instrument List - Edit", "enabled": false },
                { "key": "instrument_list_delete", "name": "Instrument List - Delete", "enabled": false },
                { "key": "instrument_form", "name": "Instrument Form", "enabled": false }
            ]
        },
        {
            "key": "management_review_meeting",
            "name": "Management Review Meeting",
            "enabled": false,
            "features": [
                { "key": "create_meeting", "name": "Create Meeting", "enabled": false },
                { "key": "mrm_list_edit", "name": "MRM List - Edit", "enabled": false },
                { "key": "mrm_list_view", "name": "MRM List - View (PDF)", "enabled": false }
            ]
        },
        {
            "key": "nc",
            "name": "Non Conformance (NC)",
            "enabled": false,
            "features": [
                { "key": "nc_history_view", "name": "NC History Table", "enabled": false },
                { "key": "nc_edit", "name": "Edit NC Details", "enabled": false },
                { "key": "nc_create", "name": "Create Non Conformance", "enabled": false }
            ]
        },
        {
            "key": "capa",
            "name": "CAPA",
            "enabled": false,
            "features": [
                { "key": "capa_create", "name": "Create CAPA", "enabled": false },
                { "key": "capa_preview", "name": "CAPA Form Preview", "enabled": false },
                { "key": "capa_list_nc", "name": "List of NC → File CAPA", "enabled": false },
                { "key": "capa_pdf_view", "name": "CAPA PDF View", "enabled": false }
            ]
        },
        {
            "key": "compliance_calendar",
            "name": "Compliance Calendar",
            "enabled": false,
            "features": [
                { "key": "compliance_dashboard", "name": "Compliance Dashboard", "enabled": false },
                { "key": "event_calendar", "name": "Event Calendar", "enabled": false },
                { "key": "create_event", "name": "Create Event", "enabled": false },
                { "key": "edit_event", "name": "Edit Event", "enabled": false },
                { "key": "delete_event", "name": "Delete Event", "enabled": false },
                { "key": "update_event_status", "name": "Update Event Status", "enabled": false },
                { "key": "document_list", "name": "Document List", "enabled": false },
                { "key": "add_document", "name": "Add Document", "enabled": false }
            ]
        },
        {
            "key": "department",
            "name": "Department",
            "enabled": false,
            "features": [
                { "key": "add_department", "name": "Add Department", "enabled": false },
                { "key": "edit_department", "name": "Edit Department", "enabled": false },
                { "key": "view_department", "name": "View Department", "enabled": false }
            ]
        },
        {
            "key": "documents",
            "name": "Documents",
            "enabled": false,
            "features": [
                { "key": "upload_document", "name": "Upload Document", "enabled": false },
                { "key": "delete_document", "name": "Delete Document", "enabled": false },
                { "key": "update_document", "name": "Update Document", "enabled": false },
                { "key": "view_document", "name": "View Document", "enabled": false }
            ]
        },
        {
            "key": "staff",
            "name": "Staff",
            "enabled": false,
            "features": [
                { "key": "create_staff", "name": "Create Staff", "enabled": false },
                { "key": "update_staff", "name": "Update Staff", "enabled": false },
                { "key": "view_staff_list", "name": "View Staff List", "enabled": false },
                { "key": "competence_form", "name": "Competence Form", "enabled": false },
                { "key": "permission_page", "name": "Permission Page", "enabled": false },
                { "key": "staff_view_mobile", "name": "Field: Mobile Number", "enabled": false },
                { "key": "staff_view_email", "name": "Field: Work Email", "enabled": false },
                { "key": "staff_view_salary", "name": "Field: Salary Details", "enabled": false },
                { "key": "staff_view_documents", "name": "Field: Personal Documents", "enabled": false }
            ]
        },
        {
            "key": "vendor",
            "name": "Vendor",
            "enabled": false,
            "features": [
                { "key": "create_vendor", "name": "Create Vendor", "enabled": false },
                { "key": "vendor_list_view", "name": "Vendor List - View", "enabled": false },
                { "key": "vendor_edit", "name": "Edit Vendor", "enabled": false },
                { "key": "vendor_delete", "name": "Delete Vendor", "enabled": false }
            ]
        },
        {
            "key": "entries_management",
            "name": "Entries Management",
            "enabled": false,
            "features": [
                { "key": "view_entries", "name": "View Entries", "enabled": false },
                { "key": "edit_entries", "name": "Edit Entries", "enabled": false },
                { "key": "delete_entries", "name": "Delete Entries", "enabled": false }
            ]
        },
        {
            "key": "quality_indicator",
            "name": "Quality Indicator",
            "enabled": false,
            "features": [
                { "key": "qi_view", "name": "View Quality Indicators", "enabled": false },
                { "key": "qi_entry", "name": "New Indicator Entry", "enabled": false },
                { "key": "qi_config", "name": "Configure Indicators", "enabled": false },
                { "key": "qi_report", "name": "View QI Reports", "enabled": false }
            ]
        },
        {
            "key": "risk_assessment",
            "name": "Risk Assessment",
            "enabled": false,
            "features": [
                { "key": "risk_assessment_view", "name": "View Risk Assessment", "enabled": false },
                { "key": "risk_assessment_create", "name": "Create Risk Assessment", "enabled": false },
                { "key": "risk_assessment_edit", "name": "Edit Risk Assessment", "enabled": false },
                { "key": "risk_matrix_view", "name": "View Risk Matrix", "enabled": false }
            ]
        },
        {
            "key": "risk_indicator",
            "name": "Risk Indicator",
            "enabled": false,
            "features": [
                { "key": "risk_indicator_view", "name": "View Risk Indicators", "enabled": false },
                { "key": "risk_indicator_entry", "name": "New Risk Entry", "enabled": false },
                { "key": "risk_indicator_config", "name": "Configure Risk Indicators", "enabled": false }
            ]
        },
        {
            "key": "training",
            "name": "Training",
            "enabled": false,
            "features": [
                { "key": "training_view", "name": "View Training List", "enabled": false },
                { "key": "training_create", "name": "Create New Training", "enabled": false },
                { "key": "training_assign", "name": "Assign Training to Staff", "enabled": false },
                { "key": "training_records_view", "name": "View Training Records", "enabled": false }
            ]
        },
        {
            "key": "onboarding",
            "name": "Onboarding",
            "enabled": false,
            "features": [
                { "key": "onboarding_view", "name": "View Onboarding Status", "enabled": false },
                { "key": "onboarding_start", "name": "Start Onboarding Flow", "enabled": false },
                { "key": "onboarding_config", "name": "Configure Onboarding Steps", "enabled": false }
            ]
        },
        {
            "key": "settings",
            "name": "Settings",
            "enabled": false,
            "features": [
                { "key": "org_settings_view", "name": "View Org Settings", "enabled": false },
                { "key": "org_settings_edit", "name": "Edit Org Settings", "enabled": false },
                { "key": "user_management", "name": "Manage User Accounts", "enabled": false }
            ]
        }
    ]
}
