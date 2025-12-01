'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, RefreshCw, Radio } from 'lucide-react';

interface SiteStatus {
    name: string;
    url: string;
    status: 'PENDING' | 'ACCESSIBLE' | 'BLOCKED';
    testImage: string; // URL of an image to test loading
}

const BLOCKED_SITES = [
    {
        name: 'Facebook',
        url: 'https://www.facebook.com',
        testImage: 'https://www.facebook.com/favicon.ico'
    },
    {
        name: 'YouTube',
        url: 'https://www.youtube.com',
        testImage: 'https://www.youtube.com/favicon.ico'
    },
    {
        name: 'The Irrawaddy',
        url: 'https://www.irrawaddy.com/',
        testImage: 'https://www.irrawaddy.com/favicon.ico'
    },
    {
        name: 'Twitter / X',
        url: 'https://twitter.com',
        testImage: 'https://abs.twimg.com/favicons/twitter.ico'
    }
];

export function CensorshipCheck() {
    const [results, setResults] = useState<SiteStatus[]>([]);
    const [running, setRunning] = useState(false);

    // Initialize results when component mounts or BLOCKED_SITES changes
    // REMOVED: We don't want to show "Checking..." before user clicks run.

    const runTest = async () => {
        setRunning(true);
        // Initialize/Reset results to 'PENDING'
        setResults(BLOCKED_SITES.map(s => ({ ...s, status: 'PENDING' })));

        const checkSite = async (site: typeof BLOCKED_SITES[0], index: number) => {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

                // Use fetch with no-cors mode. 
                // This allows us to "ping" the server even if it doesn't send CORS headers.
                // An opaque response (status 0) means the connection was successful (DNS + TCP + SSL).
                // A network error (catch block) usually means connection failed (Blocked/Timeout).
                await fetch(site.url, {
                    mode: 'no-cors',
                    signal: controller.signal,
                    cache: 'no-store'
                });

                clearTimeout(timeoutId);
                setResults(prev => {
                    const next = [...prev];
                    next[index].status = 'ACCESSIBLE';
                    return next;
                });
            } catch (error) {
                setResults(prev => {
                    const next = [...prev];
                    next[index].status = 'BLOCKED';
                    return next;
                });
            }
        };

        // Run checks in parallel
        await Promise.all(BLOCKED_SITES.map((site, index) => checkSite(site, index)));
        setRunning(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Radio className="h-5 w-5" />
                    Censorship Check
                </CardTitle>
                <CardDescription>
                    Tests if you can access sites usually blocked in Myanmar (DPI Bypass Test).
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex justify-center">
                    {!running && results.length > 0 && results[0].status === 'PENDING' && (
                        <Button onClick={runTest}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Run Connectivity Test
                        </Button>
                    )}

                    {running && (
                        <Button disabled>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Testing...
                        </Button>
                    )}

                    {!running && results.length > 0 && results[0].status !== 'PENDING' && (
                        <Button variant="outline" onClick={runTest}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Test Again
                        </Button>
                    )}
                </div>

                {results.length > 0 && (
                    <div className="grid gap-3 md:grid-cols-2">
                        {results.map((site) => (
                            <div key={site.name} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    {site.status === 'PENDING' && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                                    {site.status === 'ACCESSIBLE' && <CheckCircle className="h-5 w-5 text-green-500" />}
                                    {site.status === 'BLOCKED' && <XCircle className="h-5 w-5 text-red-500" />}
                                    <span className="font-medium">{site.name}</span>
                                </div>
                                <Badge variant={site.status === 'ACCESSIBLE' ? 'default' : site.status === 'BLOCKED' ? 'destructive' : 'secondary'}
                                    className={site.status === 'ACCESSIBLE' ? 'bg-green-600' : ''}>
                                    {site.status === 'PENDING' ? 'Checking...' : site.status}
                                </Badge>
                            </div>
                        ))}
                    </div>
                )}

                {results.some(r => r.status === 'BLOCKED') && !running && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-600 dark:text-red-400">
                        ⚠️ Some sites are blocked. Your VPN might not be bypassing the DPI fully. Try switching protocols (e.g., to V2Ray or Shadowsocks).
                    </div>
                )}

                {results.every(r => r.status === 'ACCESSIBLE') && results.length > 0 && !running && results[0].status !== 'PENDING' && (
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-sm text-green-600 dark:text-green-400">
                        ✅ All sites accessible! Your VPN is successfully bypassing censorship.
                    </div>
                )}

            </CardContent>
        </Card>
    );
}
