import { useState, useEffect } from 'react';
import { dashboardData } from '../mockData';

export function useDashboardData() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setData(dashboardData);
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return { data, loading };
}
