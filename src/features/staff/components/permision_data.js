export const PERMISSION_DATA = {
    "permissions": [
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
                { "key": "competence_form", "name": "Competence Form", "enabled": false },
                { "key": "permission_page", "name": "Permission Page", "enabled": false }
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
        }
    ]
}