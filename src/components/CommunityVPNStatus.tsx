'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Signal, SignalZero, AlertTriangle, Filter } from 'lucide-react';

interface VPNReport {
    timestamp: string;
    isp: string;
    vpnName: string;
    status: 'OK' | 'BLOCKED' | 'UNKNOWN';
    rawStatus: string;
}

const CSV_URL = 'https://docs.google.com/spreadsheets/d/1oDxKmkdUahP_54_6hn1u_jB6Q7SN-zgXuI0pIHB5V3s/export?format=csv&gid=815136729';

export function CommunityVPNStatus() {
    const [reports, setReports] = useState<VPNReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedISP, setSelectedISP] = useState<string>('All');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(CSV_URL);
            const text = await response.text();
            const parsed = parseCSV(text);
            setReports(parsed);
        } catch (error) {
            console.error('Failed to fetch VPN status data', error);
        } finally {
            setLoading(false);
        }
    };

    const parseCSV = (text: string): VPNReport[] => {
        const lines = text.split('\n');
        const data: VPNReport[] = [];

        // Skip preamble (lines 0, 1) and header (line 2). Data starts at index 3.
        // But we should be careful. Let's find the header row first.
        let startIndex = 3;

        for (let i = startIndex; i < lines.length; i++) {
            const row = lines[i];
            // Simple CSV split by comma, handling quotes is better but let's try simple first for speed
            // or use the robust parser I wrote before.
            // Let's use a regex for splitting CSV to handle quotes better
            const cols = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || row.split(',');

            // Clean up quotes
            const cleanCols = cols.map(c => c.replace(/^"|"$/g, '').trim());

            if (cleanCols.length < 5) continue;

            const isp = cleanCols[1];
            const vpnName = cleanCols[2];
            const statusText = cleanCols[4];

            if (!isp || !vpnName) continue;

            let status: 'OK' | 'BLOCKED' | 'UNKNOWN' = 'UNKNOWN';
            if (statusText.includes('လိုင်းကောင်းသည်') || statusText.includes('အဆင်ပြေ')) {
                status = 'OK';
            } else if (statusText.includes('လုံးဝမရပါ') || statusText.includes('မရပါ')) {
                status = 'BLOCKED';
            }

            data.push({
                timestamp: cleanCols[0],
                isp,
                vpnName,
                status,
                rawStatus: statusText
            });
        }
        return data;
    };

    // Get unique ISPs
    const isps = Array.from(new Set(reports.map(r => r.isp))).sort();

    // Filter reports
    const filteredReports = selectedISP === 'All'
        ? reports
        : reports.filter(r => r.isp === selectedISP);

    // Aggregate data: Group by VPN Name
    // For each VPN, count OK vs BLOCKED
    const vpnStats = filteredReports.reduce((acc, curr) => {
        if (!acc[curr.vpnName]) {
            acc[curr.vpnName] = { ok: 0, blocked: 0, total: 0, lastStatus: curr.status };
        }
        acc[curr.vpnName].total++;
        if (curr.status === 'OK') acc[curr.vpnName].ok++;
        if (curr.status === 'BLOCKED') acc[curr.vpnName].blocked++;
        return acc;
    }, {} as Record<string, { ok: number, blocked: number, total: number, lastStatus: string }>);

    // Convert to array and sort by most reported
    const vpnList = Object.entries(vpnStats)
        .map(([name, stats]) => ({ name, ...stats }))
        .sort((a, b) => b.total - a.total);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Signal className="h-5 w-5" />
                    Community VPN Status
                </CardTitle>
                <CardDescription>
                    Real-time reports on which VPNs are working by ISP.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Filter */}
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={selectedISP} onValueChange={setSelectedISP}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select ISP" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All ISPs</SelectItem>
                            {isps.map(isp => (
                                <SelectItem key={isp} value={isp}>{isp}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* List */}
                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {vpnList.map((vpn) => {
                            // Determine overall status
                            const isWorking = vpn.ok >= vpn.blocked;
                            const confidence = Math.round((Math.max(vpn.ok, vpn.blocked) / vpn.total) * 100);

                            return (
                                <div key={vpn.name} className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors">
                                    <div className="space-y-1 overflow-hidden">
                                        <p className="font-medium truncate" title={vpn.name}>{vpn.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {vpn.total} reports ({confidence}% confidence)
                                        </p>
                                    </div>
                                    <Badge variant={isWorking ? 'default' : 'destructive'} className={isWorking ? 'bg-green-600' : ''}>
                                        {isWorking ? (
                                            <span className="flex items-center gap-1">
                                                <Signal className="h-3 w-3" /> Working
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1">
                                                <SignalZero className="h-3 w-3" /> Blocked
                                            </span>
                                        )}
                                    </Badge>
                                </div>
                            );
                        })}

                        {vpnList.length === 0 && (
                            <div className="col-span-full text-center py-8 text-muted-foreground">
                                No reports found for this selection.
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
