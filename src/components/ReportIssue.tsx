'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, ExternalLink, FileText } from 'lucide-react';

export function ReportIssue() {
    const googleFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSfljCctg9O0D0PNF2ts_Obk7QnXkyCTc9F6qU91diTwSK0cig/viewform?usp=sharing&ouid=106962718734048944173";

    return (
        <Card className="border-orange-500/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                    Report VPN Issues
                </CardTitle>
                <CardDescription>
                    Help the community by reporting blocked protocols or ISPs in your area.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg text-sm space-y-2">
                    <div className="flex items-center gap-2 font-medium text-foreground">
                        <FileText className="h-4 w-4" />
                        Why Report?
                    </div>
                    <p className="text-muted-foreground">
                        Your reports help us identify which VPN protocols (like WireGuard, V2Ray) are working in specific regions (e.g., Yangon, Mandalay) and on which ISPs.
                    </p>
                </div>

                <Button className="w-full" asChild>
                    <a href={googleFormUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open Report Form
                    </a>
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                    Opens in a secure Google Form
                </p>
            </CardContent>
        </Card>
    );
}
