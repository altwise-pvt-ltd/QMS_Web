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
  FolderOpen,
  ShieldCheck,
  Microscope,
  Store,
  Library,
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
    icon: FolderOpen,
  },
  {
    label: "CAPA & Incidents",
    path: "/capa",
    icon: ClipboardList,
  },
  {
    label: "Entries Management",
    path: "/entries-management",
    icon: Library,
  },
  {
    label: "Compliance Calendar",
    path: "/compliance",
    icon: Calendar,
  },
  {
    label: "Management Review",
    path: "/mrm",
    icon: ShieldCheck,
  },
  {
    label: "Staff",
    path: "/staff",
    icon: Users,
  },
  {
    label: "Quality Indicators",
    path: "/quality-indicators",
    icon: Activity,
  },
  {
    label: "Risk Indicators",
    path: "/risk-indicators",
    icon: ShieldAlert,
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
    icon: Microscope,
  },
  {
    label: "Vendor Management",
    path: "/vendor",
    icon: Store,
  },
  {
    label: "Risk Assessment",
    path: "/risk-assessment",
    icon: ShieldAlert,
  },
];
