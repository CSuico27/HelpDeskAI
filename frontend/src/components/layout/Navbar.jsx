import { ChevronDown } from "lucide-react";

export default function Navbar({ title = "Dashboard" }) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-8">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>

      <button className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
          AS
        </div>
        <div className="text-left leading-tight">
          <p className="text-sm font-medium text-gray-900">Cielo Mae Suico</p>
          <p className="text-xs text-gray-500">Admin</p>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>
    </header>
  );
}