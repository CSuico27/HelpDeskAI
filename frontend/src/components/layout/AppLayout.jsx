import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function AppLayout() {
    const [mobileOpen, setMobileOpen] = useState(false);
    return (
        <div className="flex h-screen bg-gray-50">
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
            <Navbar />
            <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
            </main>
        </div>
        </div>
    );
}