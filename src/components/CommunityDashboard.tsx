'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Report {
    timestamp: string;
    protocol: string;
    region: string;
    isp: string;
    internetType: string;
}

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSGUGlWVfSl_tGsOM1tynFzOHxGieJLRond6T3E4L0xOBS2TX3HFyEdX1fWNQBMpw6Ww5Jbl_alrJnw/pub?output=csv';

const PROTOCOLS = ['WireGuard', 'OpenVPN (TCP/UDP)', 'V2Ray (VMess/VLESS)', 'Shadowsocks', 'Psiphon', 'IKEv2 / IPsec'];
const ISPS = ['MPT (Mobile/Fiber)', 'Atom (Telenor)', 'Ooredoo', 'Mytel', 'GlobalNet', '5BB Broadband', 'Unilink', 'Myanmar Net'];
const REGIONS = ['Yangon', 'Mandalay', 'Naypyidaw', 'Shan State', 'Kachin State', 'Karen State', 'Rakhine State', 'Mon State', 'Bago', 'Sagaing', 'Magway', 'Ayeyarwady', 'Tanintharyi', 'Chin State', 'Kayah State'];

export function CommunityDashboard() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRegion, setSelectedRegion] = useState<string>('Yangon');
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(CSV_URL);
            const text = await response.text();
            const parsed = parseCSV(text);
            setReports(parsed);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Simple CSV Parser
    const parseCSV = (text: string): Report[] => {
        const lines = text.split('\n').filter(l => l.trim() !== '');
        const data: Report[] = [];
        // Skip header (index 0)
        for (let i = 1; i < lines.length; i++) {
            // Handle quoted CSV fields roughly
            const row = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
            // Fallback split if regex fails or simple structure
            const cols = lines[i].split(',').map(c => c.replace(/^"|"$/g, '').trim());

            if (cols.length >= 4) {
                // Column mapping based on verified headers:
                // 0: Timestamp
                // 1: Protocol
                // 2: Region
                // 3: ISP
                // 4: Internet Type
                if (cols[1] && cols[2] && cols[3]) {
                    data.push({
                        timestamp: cols[0],
                        protocol: cols[1],
                        region: cols[2],
                        isp: cols[3],
                        internetType: cols[4]
                    });
                }
            }
        }
        return data;
    };

    const getStatus = (isp: string, protocol: string) => {
        const relevantReports = reports.filter(r =>
            r.region === selectedRegion &&
            r.isp === isp &&
            r.protocol === protocol
        );
        const count = relevantReports.length;

        if (count === 0) return { status: 'OK', count, color: 'bg-green-500/10 text-green-500 hover:bg-green-500/20' };
        if (count < 3) return { status: 'WARN', count, color: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20' };
        return { status: 'BLOCKED', count, color: 'bg-red-500/10 text-red-500 hover:bg-red-500/20' };
    };

    return (
        <Card className="h-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-primary" />
                            Community Dashboard
                        </CardTitle>
                        <CardDescription className="space-y-1">
                            <p>Real-time VPN blocking status crowdsourced from users across Myanmar. Check which protocols are working in your area.</p>
                            <p className="text-xs opacity-80 font-myanmar">မြန်မာနိုင်ငံအနှံ့အပြားရှိ သုံးစွဲသူများထံမှ ပေးပို့သော VPN ပိတ်ဆို့မှု အခြေအနေများ။ သင့်ဒေသတွင် မည်သည့် VPN စနစ်များ အသုံးပြု၍ရနိုင်သည်ကို ကြည့်ရှုပါ။</p>
                        </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-[200px]">
                        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Region" />
                            </SelectTrigger>
                            <SelectContent>
                                {REGIONS.map(r => (
                                    <SelectItem key={r} value={r}>{r}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Showing reports for <strong>{selectedRegion}</strong>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr>
                                <th className="p-2 text-left font-medium text-muted-foreground border-b">ISP / Protocol</th>
                                {PROTOCOLS.map(p => (
                                    <th key={p} className="p-2 text-center font-medium text-muted-foreground border-b min-w-[100px]">
                                        {p.split(' ')[0]} {/* Shorten name */}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {ISPS.map(isp => (
                                <tr key={isp} className="border-b last:border-0 hover:bg-muted/50">
                                    <td className="p-3 font-medium">{isp.split(' ')[0]}</td>
                                    {PROTOCOLS.map(protocol => {
                                        const { status, count, color } = getStatus(isp, protocol);
                                        return (
                                            <td key={protocol} className="p-2 text-center">
                                                <div className={`inline-flex items-center justify-center px-2 py-1 rounded-md text-xs font-bold ${color} w-full`}>
                                                    {status === 'OK' ? (
                                                        <CheckCircle2 className="h-4 w-4" />
                                                    ) : (
                                                        <span className="flex items-center gap-1">
                                                            {status === 'BLOCKED' ? <XCircle className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                                                            {count > 0 && <span>({count})</span>}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground justify-center">
                    <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-green-500" /> Working
                    </div>
                    <div className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3 text-yellow-500" /> Issues Reported (1-2)
                    </div>
                    <div className="flex items-center gap-1">
                        <XCircle className="h-3 w-3 text-red-500" /> Likely Blocked (3+)
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
