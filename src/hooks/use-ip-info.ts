import { useState, useEffect } from 'react';

export interface IPInfo {
    ip: string;
    city: string;
    region: string;
    country_name: string;
    org: string; // ISP
    error?: string;
}

export function useIPInfo() {
    const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchIP = async () => {
        setLoading(true);
        setError(null);
        try {
            // Using ipapi.co as it provides good location data
            // In production, we might want a fallback or a paid API key
            const response = await fetch('https://ipapi.co/json/');
            if (!response.ok) {
                throw new Error('Failed to fetch IP info');
            }
            const data = await response.json();
            setIpInfo(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIP();
    }, []);

    return { ipInfo, loading, error, refetch: fetchIP };
}
