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
            // Try Primary API (ipapi.co)
            const response = await fetch('https://ipapi.co/json/');
            if (response.ok) {
                const data = await response.json();
                setIpInfo(data);
                return;
            }
            throw new Error('Primary API failed');
        } catch (err) {
            console.warn('Primary IP API failed, trying fallback...', err);
            try {
                // Try Fallback API (ipwho.is) - Free, no key, no HTTPS restriction usually
                const fallbackResponse = await fetch('https://ipwho.is/');
                if (!fallbackResponse.ok) throw new Error('Fallback API failed');

                const data = await fallbackResponse.json();
                if (!data.success) throw new Error(data.message || 'Fallback API error');

                // Map ipwho.is response to our interface
                setIpInfo({
                    ip: data.ip,
                    city: data.city,
                    region: data.region,
                    country_name: data.country,
                    org: data.connection?.isp || data.connection?.org || 'Unknown ISP'
                });
            } catch (fallbackErr) {
                setError('Could not detect IP. Service might be blocked.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIP();
    }, []);

    return { ipInfo, loading, error, refetch: fetchIP };
}
