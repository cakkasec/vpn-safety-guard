import React, { useState } from 'react';
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

// Knowledge Base Data
const vpnDatabase: VPNApp[] = [
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
    },

    // Unsafe / High Risk (Free/Ad-heavy/Logging)
    {
        name: 'Turbo VPN',
        risk: 'UNSAFE',
        protocol: 'Unknown / IKEv2',
        advice: 'Cyber Guardian says: ❌ AVOID. Known for logging user data and showing ads. Not safe for sensitive activities.'
    },
    {
        name: 'Super VPN',
        risk: 'UNSAFE',
        protocol: 'Unknown',
        advice: 'Cyber Guardian says: ❌ DANGEROUS. History of data leaks and malware. Do not use.'
    },
    {
        name: 'Thunder VPN',
        risk: 'UNSAFE',
        protocol: 'Unknown',
        advice: 'Cyber Guardian says: ❌ High Risk. Free VPNs sell your data. Not resistant to DPI.'
    },
    {
        name: 'Hula VPN',
        risk: 'UNSAFE',
        protocol: 'Unknown',
        advice: 'Cyber Guardian says: ❌ Be careful. Free services often log your IP. Use a trusted paid or open-source alternative.'
    },
    {
        name: 'Jump Jump VPN',
        risk: 'UNSAFE',
        protocol: 'Unknown',
        advice: 'Cyber Guardian says: ❌ Unknown security. Likely logs data. Better to use Outline or Proton.'
    },
    {
        name: 'X-VPN',
        risk: 'UNSAFE',
        protocol: 'Proprietary',
        advice: 'Cyber Guardian says: ⚠️ Hit or miss. Free version is not private. Paid version is okay but there are better options.'
    },
    {
        name: 'Now VPN',
        risk: 'UNSAFE',
        protocol: 'Unknown',
        advice: 'Cyber Guardian says: ❌ Generic free VPN. High risk of logging and tracking.'
    }
];

export function VPNKnowledgeBase() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredVPNs = vpnDatabase.filter(vpn =>
        vpn.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    App Integrity Check
                </CardTitle>
                <CardDescription>
                    Search for your VPN app name to see if it is trusted by the Cyber Guardian.
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
                    />
                </div>

                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {searchTerm && filteredVPNs.length === 0 ? (
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
