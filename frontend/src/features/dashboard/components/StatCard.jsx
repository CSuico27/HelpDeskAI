export default function StatCard({ label, value, change }) {
  const positive = change >= 0;
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
      <p className={`mt-1 text-xs ${positive ? "text-green-600" : "text-red-600"}`}>
        {positive ? "+" : ""}{change}% vs last week
      </p>
    </div>
  );
}