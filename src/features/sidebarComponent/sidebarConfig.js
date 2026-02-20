import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  Calendar,
  Presentation,
  Users,
  BarChart3,
  AlertTriangle,
  GraduationCap,
  Building2,
  Activity,
  Truck,
  ShieldAlert,
} from "lucide-react";

export const sidebarConfig = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Documents",
    path: "/documents",
    icon: FileText,
  },
  {
    label: "CAPA & Incidents",
    path: "/capa",
    icon: ClipboardList,
  },
  {
    label: "Entries Management",
    path: "/entries-management",
    icon: ClipboardList,
  },
  {
    label: "Compliance Calendar",
    path: "/compliance",
    icon: Calendar,
  },
  {
    label: "Management Review",
    path: "/mrm",
    icon: Presentation,
  },
  {
    label: "Staff",
    path: "/staff",
    icon: Users,
  },
  {
    label: "Quality Indicators",
    path: "/quality-indicators",
    icon: BarChart3,
  },
  {
    label: "Risk Indicators",
    path: "/risk-indicators",
    icon: AlertTriangle,
  },
  {
    label: "Training",
    path: "/training",
    icon: GraduationCap,
  },
  {
    label: "Department",
    path: "/department",
    icon: Building2,
  },
  {
    label: "Instrument Calibration",
    path: "/instrument",
    icon: Activity,
  },
  {
    label: "Vendor Management",
    path: "/vendor",
    icon: Truck,
  },
  {
    label: "Risk Assessment",
    path: "/risk-assessment",
    icon: ShieldAlert,
  },
];
