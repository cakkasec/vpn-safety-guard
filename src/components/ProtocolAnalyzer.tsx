import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Shield, ShieldAlert, ShieldCheck, Lock } from 'lucide-react';

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

interface ProtocolInfo {
    name: string;
    risk: RiskLevel;
    description: string;
    recommendation: string;
}

const protocols: Record<string, ProtocolInfo> = {
    'openvpn': {
        name: 'OpenVPN (Standard)',
        risk: 'HIGH',
        description: 'Standard OpenVPN is easily detected by Deep Packet Inspection (DPI). The military junta can likely see you are using a VPN and block the connection.',
        recommendation: 'Avoid using standard OpenVPN. Use with "Obfuscation" or "Scramble" plugins if available, or switch to V2Ray/Shadowsocks.'
    },
    'wireguard': {
        name: 'WireGuard',
        risk: 'MEDIUM',
        description: 'WireGuard is faster and more secure than OpenVPN, but it has a distinct fingerprint that can be detected and blocked by advanced firewalls.',
        recommendation: 'Good for speed, but if you face blocking, switch to an obfuscated protocol like V2Ray or Shadowsocks.'
    },
    'shadowsocks': {
        name: 'Shadowsocks',
        risk: 'LOW',
        description: 'Designed specifically to bypass censorship. It looks like normal HTTPS traffic to firewalls, making it very hard to detect.',
        recommendation: 'Highly recommended for Myanmar. Use with a reputable provider.'
    },
    'v2ray': {
        name: 'V2Ray / VMess / VLESS',
        risk: 'LOW',
        description: 'Advanced obfuscation protocol. Can mimic web browsing traffic perfectly (Reality/Vision), making it extremely difficult for the junta to detect.',
        recommendation: 'The Gold Standard for bypassing censorship. Use "Reality" or "Vision" variants for best results.'
    },
    'ikev2': {
        name: 'IKEv2 / IPSec',
        risk: 'HIGH',
        description: 'Older standard protocol. Easily detected and often blocked by default on mobile networks.',
        recommendation: 'Not recommended for high-censorship environments.'
    },
    'tor': {
        name: 'Tor (The Onion Router)',
        risk: 'MEDIUM',
        description: 'Provides high anonymity but is very slow. Tor bridges can bypass censorship, but standard Tor nodes are public and easily blocked.',
        recommendation: 'Use only with "Bridges" (Snowflake/Obfs4) for bypassing blocking. Good for browsing, bad for streaming.'
    }
};

export function ProtocolAnalyzer() {
    const [selectedProtocol, setSelectedProtocol] = useState<string>('');

    const info = selectedProtocol ? protocols[selectedProtocol] : null;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Protocol Risk Analyzer
                </CardTitle>
                <CardDescription>
                    Select your VPN protocol to check its safety against censorship and tracking.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Select Protocol</label>
                    <Select onValueChange={setSelectedProtocol}>
                        <SelectTrigger>
                            <SelectValue placeholder="Choose a protocol..." />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(protocols).map(([key, p]) => (
                                <SelectItem key={key} value={key}>{p.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {info && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">Risk Level:</span>
                            <Badge variant={info.risk === 'HIGH' ? 'destructive' : info.risk === 'MEDIUM' ? 'secondary' : 'default'}
                                className={info.risk === 'LOW' ? 'bg-green-600 hover:bg-green-700' : ''}>
                                {info.risk}
                            </Badge>
                        </div>

                        <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                            <div className="flex gap-3">
                                {info.risk === 'HIGH' ? <ShieldAlert className="h-5 w-5 text-red-500 shrink-0" /> :
                                    info.risk === 'MEDIUM' ? <Lock className="h-5 w-5 text-yellow-500 shrink-0" /> :
                                        <ShieldCheck className="h-5 w-5 text-green-500 shrink-0" />}
                                <p className="text-sm leading-relaxed">{info.description}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-semibold text-sm">Recommendation</h4>
                            <p className="text-sm text-muted-foreground">{info.recommendation}</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
