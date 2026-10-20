import { useState, useEffect } from "react";
import { dashboardData } from "../mockData";

export function useDashboardData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate a request. Later: fetch("/api/dashboard/stats")
    const t = setTimeout(() => {
      setData(dashboardData);
      setLoading(false);
    }, 500);
    return () => clearTimeout(t);
  }, []);

  return { data, loading, error };
}