'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Activity, Globe, Server } from 'lucide-react';

interface OONIStats {
    measurement_count: number;
    network_count: number;
    first_bucket_date: string;
}

export function OONIStatus() {
    const [stats, setStats] = useState<OONIStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('https://api.ooni.io/api/_/country_overview?probe_cc=MM');
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Failed to fetch OONI stats', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <Card className="h-full border-primary/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                    <Activity className="h-5 w-5" />
                    OONI Myanmar Status
                </CardTitle>
                <CardDescription>
                    Real-time network censorship monitoring data from Open Observatory of Network Interference.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-card border border-border">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Server className="h-4 w-4" />
                            <span className="text-xs font-medium uppercase">Measurements</span>
                        </div>
                        <div className="text-2xl font-bold font-mono">
                            {loading ? '...' : stats?.measurement_count.toLocaleString()}
                        </div>
                    </div>
                    <div className="p-4 rounded-lg bg-card border border-border">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Globe className="h-4 w-4" />
                            <span className="text-xs font-medium uppercase">Networks Monitored</span>
                        </div>
                        <div className="text-2xl font-bold font-mono">
                            {loading ? '...' : stats?.network_count.toLocaleString()}
                        </div>
                    </div>
                </div>

                <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => window.open('https://explorer.ooni.org/country/MM', '_blank')}
                >
                    View Full OONI Report
                    <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
            </CardContent>
        </Card>
    );
}
