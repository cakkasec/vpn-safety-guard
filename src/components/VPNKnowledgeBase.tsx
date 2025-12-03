import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ShieldAlert, ShieldCheck, Lock, AlertTriangle } from 'lucide-react';

type RiskLevel = 'SAFE' | 'CAUTION' | 'UNSAFE';

interface VPNApp {
    name: string;
    risk: RiskLevel;
    protocol: string;
    advice: string;
}

const CSV_URL = 'https://docs.google.com/spreadsheets/d/1Q9C2Ww8iO_ohpVh2XkcVtwI_3alFXFtZHxDeuj4khzw/export?format=csv&gid=812504312';

export function VPNKnowledgeBase() {
    const [searchTerm, setSearchTerm] = useState('');
    const [vpnDatabase, setVpnDatabase] = useState<VPNApp[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(CSV_URL);
                const text = await response.text();
                const parsed = parseCSV(text);
                setVpnDatabase(parsed);
            } catch (error) {
                console.error('Failed to fetch VPN database', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const parseCSV = (text: string): VPNApp[] => {
        const lines = text.split('\n').filter(l => l.trim() !== '');
        const data: VPNApp[] = [];

        // Skip header (start from index 1 usually, but let's be safe and check)
        // Header row seems to be around line 7 in the raw output, but let's assume standard CSV for now 
        // and filter out metadata rows if they exist.
        // Based on curl output:
        // Line 1-6 are metadata. Line 7 is empty. Line 8 is Header "App Id,App Name..."

        let headerFound = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (!headerFound) {
                if (line.includes('App Id,App Name')) {
                    headerFound = true;
                }
                continue;
            }

            // Handle CSV parsing (simple split for now, but better to use regex for quoted fields)
            const cols = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
            // Clean quotes
            const cleanCols = cols.map(c => c.replace(/^"|"$/g, '').trim());

            if (cleanCols.length > 5) {
                const name = cleanCols[1]; // App Name
                const encrypted = cleanCols[4]; // Encrypted
                const ipLeak = cleanCols[5]; // IP Leak
                const dnsLeak = cleanCols[6]; // DNS Leak
                const webrtcLeak = cleanCols[7]; // WebRTC Leak
                const protocol = cleanCols[9]; // VPN Tunnel Protocol

                let risk: RiskLevel = 'SAFE';
                let advice = 'Cyber Guardian says: ✅ Verified Safe. No leaks detected.';

                // Risk Logic
                const issues = [];
                if (encrypted !== 'Encrypted') {
                    risk = 'UNSAFE';
                    issues.push('Not Encrypted');
                }
                if (ipLeak !== 'No Leaks') {
                    risk = 'UNSAFE';
                    issues.push('IP Leaks');
                }
                if (webrtcLeak !== 'No Leaks' && webrtcLeak !== 'No') {
                    risk = 'UNSAFE';
                    issues.push('WebRTC Leaks');
                }
                if (dnsLeak !== 'No Leaks' && !dnsLeak.includes('No leak')) {
                    // Some DNS leaks might be minor, but let's flag them as CAUTION if not already UNSAFE
                    if (risk === 'SAFE') risk = 'CAUTION';
                    issues.push('DNS Leaks');
                }

                if (risk === 'UNSAFE') {
                    advice = `Cyber Guardian says: ❌ DANGEROUS. Issues: ${issues.join(', ')}. Do not use.`;
                } else if (risk === 'CAUTION') {
                    advice = `Cyber Guardian says: ⚠️ CAUTION. Issues: ${issues.join(', ')}. Use with care.`;
                }

                data.push({
                    name: name || 'Unknown App',
                    risk,
                    protocol: protocol || 'Unknown',
                    advice
                });
            }
        }
        return data;
    };

    const filteredVPNs = vpnDatabase.filter(vpn =>
        vpn.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    App Integrity Check
                </CardTitle>
                <CardDescription className="space-y-1">
                    <p>Search for your VPN app name to see if it is trusted by the Cyber Guardian.</p>
                    <p className="text-xs opacity-80 font-myanmar">သင်လက်ရှိအသုံးပြုနေသော VPN သည် ယုံကြည်စိတ်ချ၍ရမရ သိရှိနိုင်ရန် အမည်ကို English စာဖြင့်ရိုက်၍ရှာဖွေနိုင်ပါသည်။</p>
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search VPN name (e.g., Turbo, Proton)..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {loading ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>Loading database...</p>
                        </div>
                    ) : searchTerm && filteredVPNs.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                            <p>Unknown App.</p>
                            <p className="text-sm">If it's not on our list, treat it as <strong>UNSAFE</strong> until verified.</p>
                        </div>
                    ) : (
                        (searchTerm ? filteredVPNs : []).map((vpn) => (
                            <div key={vpn.name} className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm animate-in fade-in slide-in-from-top-2">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-bold text-lg">{vpn.name}</h3>
                                    <Badge variant={
                                        vpn.risk === 'UNSAFE' ? 'destructive' :
                                            vpn.risk === 'CAUTION' ? 'secondary' : 'default'
                                    } className={vpn.risk === 'SAFE' ? 'bg-green-600 hover:bg-green-700' : ''}>
                                        {vpn.risk}
                                    </Badge>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-start gap-2 text-sm">
                                        <span className="font-semibold min-w-[70px]">Protocol:</span>
                                        <span className="text-muted-foreground">{vpn.protocol}</span>
                                    </div>
                                    <div className="flex items-start gap-2 text-sm bg-muted/50 p-2 rounded">
                                        {vpn.risk === 'UNSAFE' ? <ShieldAlert className="h-4 w-4 text-red-500 mt-0.5 shrink-0" /> :
                                            vpn.risk === 'CAUTION' ? <Lock className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" /> :
                                                <ShieldCheck className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />}
                                        <p className="leading-tight">{vpn.advice}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    {!searchTerm && (
                        <div className="text-center text-sm text-muted-foreground py-4">
                            Type a name above to search the database.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
