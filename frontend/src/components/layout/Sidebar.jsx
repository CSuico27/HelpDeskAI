import { NavLink } from "react-router-dom";
import { Layers } from "lucide-react";
import { navItems } from "./navItems";
import { useAuth } from "../../features/authentication/context/useAuth";

export default function Sidebar() {
  const { logout, loggingOut } = useAuth();
  const linkClass = (isActive) =>
  [
    "flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
    isActive ? "bg-indigo-50 text-indigo-700" : "text-gray-700 hover:bg-gray-50",
  ].join(" ");

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-gray-200 bg-white">
      {/* Brand: same height as the topbar so the lines align */}
      <div className="flex h-16 items-center gap-2 px-6">
        <Layers className="h-6 w-6 text-indigo-600" />
        <span className="text-lg font-bold text-indigo-600">HelpDeskAI</span>
      </div>

      <nav className="space-y-1 px-4 pt-4 cursor-pointer">
        {navItems.map(({ label, to, icon: Icon, action }) =>
          action === "logout" ? (
            <button key={label} type="button" onClick={logout} disabled={loggingOut} className={linkClass(false)}>
              <Icon className="h-5 w-5 shrink-0" />
              {loggingOut ? "Logout" : label}
            </button>
          ) : (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) => linkClass(isActive)}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </NavLink>
          )
        )}
      </nav>
    </aside>
  );
}