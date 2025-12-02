import React from 'react';
import { useIPInfo } from '@/hooks/use-ip-info';
import { useWebRTCCheck } from '@/hooks/use-webrtc-check';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert, ShieldCheck, Loader2, Globe, Network } from 'lucide-react';

export function LeakTest() {
    const { ipInfo, loading: ipLoading, error: ipError } = useIPInfo();
    const { leakedIPs, checking: webrtcChecking } = useWebRTCCheck();

    if (ipLoading) {
        return (
            <Card>
                <CardContent className="pt-6 flex justify-center items-center h-32">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">Analyzing connection...</span>
                </CardContent>
            </Card>
        );
    }

    if (ipError) {
        return (
            <Alert variant="destructive">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Failed to fetch IP information: {ipError}</AlertDescription>
            </Alert>
        );
    }

    const isWebRTCLeak = leakedIPs.length > 0 && ipInfo && !leakedIPs.includes(ipInfo.ip);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        Public IP & Location
                    </CardTitle>
                    <CardDescription>This is how the internet sees you.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">IP Address</p>
                        <p className="text-2xl font-bold font-mono">{ipInfo?.ip}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Location</p>
                        <p className="text-lg">{ipInfo?.city}, {ipInfo?.region}, {ipInfo?.country_name}</p>
                    </div>
                    <div className="space-y-1 md:col-span-2">
                        <p className="text-sm font-medium text-muted-foreground">ISP / Organization</p>
                        <p className="text-lg">{ipInfo?.org}</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Network className="h-5 w-5" />
                        WebRTC Leak Test
                    </CardTitle>
                    <CardDescription>Checks if your real IP is leaking through WebRTC.</CardDescription>
                </CardHeader>
                <CardContent>
                    {webrtcChecking ? (
                        <div className="flex items-center text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Checking for leaks...
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {leakedIPs.length === 0 ? (
                                <Alert className="bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-400">
                                    <ShieldCheck className="h-4 w-4" />
                                    <AlertTitle>No WebRTC Leaks Detected</AlertTitle>
                                    <AlertDescription>Your browser is not revealing any local or public IPs via WebRTC.</AlertDescription>
                                </Alert>
                            ) : (
                                <div className="space-y-2">
                                    {isWebRTCLeak ? (
                                        <Alert variant="destructive">
                                            <ShieldAlert className="h-4 w-4" />
                                            <AlertTitle>Potential Leak Detected!</AlertTitle>
                                            <AlertDescription>
                                                WebRTC is exposing IPs different from your main connection: {leakedIPs.join(', ')}
                                            </AlertDescription>
                                        </Alert>
                                    ) : (
                                        <Alert className="bg-yellow-500/10 border-yellow-500/50 text-yellow-700 dark:text-yellow-400">
                                            <ShieldCheck className="h-4 w-4" />
                                            <AlertTitle>WebRTC Exposed (Safe)</AlertTitle>
                                            <AlertDescription>
                                                WebRTC is active but exposing the same IP as your VPN ({leakedIPs.join(', ')}). This is usually safe but disabling WebRTC is recommended for maximum privacy.
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </div>
                            )}
                            <p className="text-xs text-muted-foreground pt-2 border-t">
                                If you see a leak while connected to VPN, you should disable WebRTC in your browser settings (e.g., "WebRTC Control" extension in Brave/Firefox).
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
