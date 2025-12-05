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

const HARDCODED_VPNS: VPNApp[] = [
    // Safe / Recommended
    {
        name: 'Mullvad VPN',
        risk: 'SAFE',
        protocol: 'WireGuard / OpenVPN (Bridge)',
        advice: 'Cyber Guardian says: ✅ Excellent choice! No logs, anonymous account numbers. Very safe.'
    },
    {
        name: 'Proton VPN',
        risk: 'SAFE',
        protocol: 'Stealth / WireGuard',
        advice: 'Cyber Guardian says: ✅ Trusted Swiss privacy. Use the "Stealth" protocol setting to bypass blocking.'
    },
    {
        name: 'Outline',
        risk: 'SAFE',
        protocol: 'Shadowsocks',
        advice: 'Cyber Guardian says: ✅ Highly recommended. You control the server. Very hard for the junta to detect.'
    },
    {
        name: 'Amnezia VPN',
        risk: 'SAFE',
        protocol: 'AmneziaWG / X-Ray',
        advice: 'Cyber Guardian says: ✅ Designed for censorship resistance. Excellent for hosting your own server.'
    },
    {
        name: 'V2Box',
        risk: 'SAFE',
        protocol: 'V2Ray Client',
        advice: 'Cyber Guardian says: ✅ Great client for V2Ray. Safe if you use a good server config (VMess/VLESS).'
    },
    // Caution / Medium
    {
        name: 'ExpressVPN',
        risk: 'CAUTION',
        protocol: 'Lightway (Obfuscated)',
        advice: 'Cyber Guardian says: ⚠️ Good security, but a high-profile target. If it connects, it is safe, but it is often blocked.'
    },
    {
        name: 'Psiphon',
        risk: 'CAUTION',
        protocol: 'SSH / Obfuscation',
        advice: 'Cyber Guardian says: ⚠️ Good for emergencies, but they log some data and it can be slow. Use only if others fail.'
    },
    {
        name: 'Wire',
        risk: 'CAUTION',
        protocol: 'WireGuard',
        advice: 'Cyber Guardian says: ⚠️ WireGuard is fast but easily detected. Use only if you are sure it is not being blocked.'
    }
];

export function VPNKnowledgeBase() {
    const [searchTerm, setSearchTerm] = useState('');
    const [vpnDatabase, setVpnDatabase] = useState<VPNApp[]>(HARDCODED_VPNS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(CSV_URL);
                const text = await response.text();
                const parsed = parseCSV(text);

                // Merge hardcoded with parsed, avoiding duplicates (prefer hardcoded if same name exists, or just append)
                // Since hardcoded are "Trusted/Known", let's keep them and append the sheet data.
                // We can filter out sheet data if it matches a hardcoded name to avoid double entries.
                const hardcodedNames = new Set(HARDCODED_VPNS.map(v => v.name.toLowerCase()));
                const newEntries = parsed.filter(v => !hardcodedNames.has(v.name.toLowerCase()));

                setVpnDatabase([...HARDCODED_VPNS, ...newEntries]);
            } catch (error) {
                console.error('Failed to fetch VPN database', error);
                // Even if fetch fails, we still have hardcoded data
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const parseCSV = (text: string): VPNApp[] => {
        const data: VPNApp[] = [];
        let rows: string[][] = [];
        let currentRow: string[] = [];
        let currentCell = '';
        let inQuotes = false;

        // Robust CSV State Machine Parser
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const nextChar = text[i + 1];

            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    // Escaped quote ("") -> add single quote
                    currentCell += '"';
                    i++; // Skip next quote
                } else {
                    // Toggle quote state
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                // End of cell
                currentRow.push(currentCell.trim());
                currentCell = '';
            } else if ((char === '\r' || char === '\n') && !inQuotes) {
                // End of row
                // Handle \r\n or just \n or \r
                if (char === '\r' && nextChar === '\n') i++;

                if (currentCell || currentRow.length > 0) {
                    currentRow.push(currentCell.trim());
                    rows.push(currentRow);
                }
                currentRow = [];
                currentCell = '';
            } else {
                currentCell += char;
            }
        }
        // Push last row if exists
        if (currentCell || currentRow.length > 0) {
            currentRow.push(currentCell.trim());
            rows.push(currentRow);
        }

        // Process parsed rows
        let headerFound = false;

        for (const cols of rows) {
            // Check for header row
            if (!headerFound) {
                // Join columns to check for header signature
                const rowString = cols.join(',');
                if (rowString.includes('App Id') && rowString.includes('App Name')) {
                    headerFound = true;
                }
                continue;
            }

            if (cols.length > 5) {
                // Clean up any remaining quotes around the values if they exist (though our parser handles most)
                // The parser above extracts content *inside* quotes but doesn't strip the outer quotes if we didn't add them to currentCell.
                // Actually, my logic above adds *everything* except the toggling quotes.
                // Let's refine: The logic above ADDS the quote if it's part of the content.
                // But standard CSV: "Value" -> Value. 
                // My logic: char === '"' -> toggles inQuotes. It does NOT add the quote to currentCell.
                // So currentCell will be clean of enclosing quotes!

                const name = cols[1];
                const encrypted = cols[4];
                const ipLeak = cols[5];
                const dnsLeak = cols[6];
                const webrtcLeak = cols[7];
                const protocol = cols[9];

                // Skip empty or malformed rows
                if (!name || !encrypted) continue;

                let risk: RiskLevel = 'SAFE';
                let advice = 'Cyber Guardian says: ✅ Verified Safe. No leaks detected.';

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
                    if (risk === 'SAFE') risk = 'CAUTION';
                    issues.push('DNS Leaks');
                }

                if (risk === 'UNSAFE') {
                    advice = `Cyber Guardian says: ❌ DANGEROUS. Issues: ${issues.join(', ')}. Do not use.`;
                } else if (risk === 'CAUTION') {
                    advice = `Cyber Guardian says: ⚠️ CAUTION. Issues: ${issues.join(', ')}. Use with care.`;
                }

                data.push({
                    name: name,
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
                    VPN Safety Check
                </CardTitle>
                <CardDescription className="space-y-1">
                    <p className="font-medium text-primary">VPN App လုံခြုံစိတ်ချရမှု စစ်ဆေးခြင်း</p>
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
