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
    const [testing, setTesting] = useState(false);

    const runTest = async () => {
        setTesting(true);
        const newResults: SiteStatus[] = BLOCKED_SITES.map(s => ({ ...s, status: 'PENDING' }));
        setResults(newResults);

        // We use a Promise.all to run checks in parallel
        const checks = BLOCKED_SITES.map(async (site, index) => {
            return new Promise<void>((resolve) => {
                const img = new Image();
                const timeout = setTimeout(() => {
                    // Timeout implies blocked or very slow
                    setResults(prev => {
                        const next = [...prev];
                        next[index].status = 'BLOCKED';
                        return next;
                    });
                    resolve();
                }, 5000); // 5 second timeout

                img.onload = () => {
                    clearTimeout(timeout);
                    setResults(prev => {
                        const next = [...prev];
                        next[index].status = 'ACCESSIBLE';
                        return next;
                    });
                    resolve();
                };

                img.onerror = () => {
                    clearTimeout(timeout);
                    // On error, it might be blocked OR just a CORS error that prevents reading, 
                    // but usually for favicons it works if accessible. 
                    // However, strict blocking usually results in a timeout or connection reset.
                    // If we get an immediate error, it might be accessible but blocking the image load.
                    // For this simple test, we'll assume success if we get a response (even error) vs timeout,
                    // BUT usually blocked sites just time out or fail DNS.
                    // Let's be conservative: if it fails to load, we mark as blocked/warning.
                    // Actually, for favicons, if they are blocked, they won't load.
                    setResults(prev => {
                        const next = [...prev];
                        next[index].status = 'BLOCKED';
                        return next;
                    });
                    resolve();
                };

                // Add a random param to avoid caching
                img.src = `${site.testImage}?t=${Date.now()}`;
            });
        });

        await Promise.all(checks);
        setTesting(false);
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
                    {!testing && results.length === 0 && (
                        <Button onClick={runTest}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Run Connectivity Test
                        </Button>
                    )}

                    {testing && (
                        <Button disabled>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Testing...
                        </Button>
                    )}

                    {!testing && results.length > 0 && (
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

                {results.some(r => r.status === 'BLOCKED') && !testing && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-600 dark:text-red-400">
                        ⚠️ Some sites are blocked. Your VPN might not be bypassing the DPI fully. Try switching protocols (e.g., to V2Ray or Shadowsocks).
                    </div>
                )}

                {results.every(r => r.status === 'ACCESSIBLE') && results.length > 0 && !testing && (
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-sm text-green-600 dark:text-green-400">
                        ✅ All sites accessible! Your VPN is successfully bypassing censorship.
                    </div>
                )}

            </CardContent>
        </Card>
    );
}
