import { useState, useEffect } from 'react';

export interface IPInfo {
    ip: string;
    city: string;
    region: string;
    country_name: string;
    org: string; // ISP
    dns?: {
        ip: string;
        geo: string;
    };
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
            // Fetch IP and DNS in parallel
            const [ipRes, dnsRes] = await Promise.all([
                fetch('https://ipapi.co/json/'),
                fetch('https://edns.ip-api.com/json')
            ]);

            let ipData: any = {};
            let dnsData: any = {};

            if (ipRes.ok) {
                ipData = await ipRes.json();
            } else {
                throw new Error('Primary IP API failed');
            }

            if (dnsRes.ok) {
                dnsData = await dnsRes.json();
            }

            setIpInfo({
                ip: ipData.ip,
                city: ipData.city,
                region: ipData.region,
                country_name: ipData.country_name,
                org: ipData.org,
                dns: dnsData.dns ? {
                    ip: dnsData.dns.ip,
                    geo: dnsData.dns.geo
                } : undefined
            });

        } catch (err) {
            console.warn('Primary IP API failed, trying fallback...', err);
            try {
                // Try Fallback API (ipwho.is)
                const fallbackResponse = await fetch('https://ipwho.is/');
                if (!fallbackResponse.ok) throw new Error('Fallback API failed');

                const data = await fallbackResponse.json();
                if (!data.success) throw new Error(data.message || 'Fallback API error');

                // Try fetching DNS again if it failed or wasn't tried
                let dnsFallback = undefined;
                try {
                    const dnsRes = await fetch('https://edns.ip-api.com/json');
                    if (dnsRes.ok) {
                        const d = await dnsRes.json();
                        if (d.dns) dnsFallback = { ip: d.dns.ip, geo: d.dns.geo };
                    }
                } catch (e) { console.warn('DNS fetch failed'); }

                setIpInfo({
                    ip: data.ip,
                    city: data.city,
                    region: data.region,
                    country_name: data.country,
                    org: data.connection?.isp || data.connection?.org || 'Unknown ISP',
                    dns: dnsFallback
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
