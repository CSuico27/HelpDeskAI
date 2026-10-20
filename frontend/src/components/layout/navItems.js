
import {
  LayoutDashboard,
  Ticket,
  Users,
  LogOut,
} from "lucide-react";

export const navItems = [
  {
    label: "Dashboard",
    to: "/",
    icon: LayoutDashboard,
    roles: ["admin", "agent", "user"],
  },
  {
    label: "Tickets",
    to: "/tickets",
    icon: Ticket,
    roles: ["admin", "agent", "user"],
  },
  {
    label: "User Management",
    to: "/team",
    icon: Users,
    roles: ["admin"],
  },
  {
  label: "Logout",
  action: "logout",
  icon: LogOut,
  roles: ["admin", "agent", "user"],
},
];
