'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, CheckCircle2, Send, Loader2 } from 'lucide-react';


export function ReportIssue() {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const data = {
            protocol: formData.get('protocol'),
            region: formData.get('region'),
            isp: formData.get('isp'),
            internetType: formData.get('connection'),
            contact: formData.get('contact'),
        };

        try {
            const response = await fetch('/api/report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setSubmitted(true);
            } else {
                setError('Failed to send report. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <Card className="border-green-500/20 bg-green-500/5">
                <CardContent className="pt-6 text-center space-y-4">
                    <div className="flex justify-center">
                        <CheckCircle2 className="h-12 w-12 text-green-500" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-green-500">Report Sent!</h3>
                        <p className="text-muted-foreground">Thank you for helping us track censorship in Myanmar.</p>
                    </div>
                    <Button variant="outline" onClick={() => setSubmitted(false)}>
                        Send Another Report
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                    Report VPN Issues
                </CardTitle>
                <CardDescription>
                    Help the community by reporting blocked protocols or ISPs in your area.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="protocol">Which VPN protocol is not working?</Label>
                        <Select name="protocol" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Protocol" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="WireGuard">WireGuard</SelectItem>
                                <SelectItem value="OpenVPN (TCP/UDP)">OpenVPN (TCP/UDP)</SelectItem>
                                <SelectItem value="V2Ray (VMess/VLESS)">V2Ray (VMess/VLESS)</SelectItem>
                                <SelectItem value="Shadowsocks">Shadowsocks</SelectItem>
                                <SelectItem value="Psiphon">Psiphon</SelectItem>
                                <SelectItem value="IKEv2 / IPsec">IKEv2 / IPsec</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="region">What region are you in?</Label>
                        <Select name="region" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select State/Region" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Yangon">Yangon</SelectItem>
                                <SelectItem value="Mandalay">Mandalay</SelectItem>
                                <SelectItem value="Naypyidaw">Naypyidaw</SelectItem>
                                <SelectItem value="Shan State">Shan State</SelectItem>
                                <SelectItem value="Kachin State">Kachin State</SelectItem>
                                <SelectItem value="Karen State">Karen State</SelectItem>
                                <SelectItem value="Rakhine State">Rakhine State</SelectItem>
                                <SelectItem value="Mon State">Mon State</SelectItem>
                                <SelectItem value="Bago">Bago</SelectItem>
                                <SelectItem value="Sagaing">Sagaing</SelectItem>
                                <SelectItem value="Magway">Magway</SelectItem>
                                <SelectItem value="Ayeyarwady">Ayeyarwady</SelectItem>
                                <SelectItem value="Tanintharyi">Tanintharyi</SelectItem>
                                <SelectItem value="Chin State">Chin State</SelectItem>
                                <SelectItem value="Kayah State">Kayah State</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="isp">What is your ISP?</Label>
                        <Select name="isp" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select ISP" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="MPT (Mobile/Fiber)">MPT (Mobile/Fiber)</SelectItem>
                                <SelectItem value="Atom (Telenor)">Atom (Telenor)</SelectItem>
                                <SelectItem value="Ooredoo">Ooredoo</SelectItem>
                                <SelectItem value="Mytel">Mytel</SelectItem>
                                <SelectItem value="GlobalNet">GlobalNet</SelectItem>
                                <SelectItem value="5BB Broadband">5BB Broadband</SelectItem>
                                <SelectItem value="Unilink">Unilink</SelectItem>
                                <SelectItem value="Myanmar Net">Myanmar Net</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="connection">Internet Type</Label>
                        <Select name="connection" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Connection Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Mobile Data">Mobile Data</SelectItem>
                                <SelectItem value="Wifi / Fiber">Wifi / Fiber</SelectItem>
                                <SelectItem value="Starlink / Satellite">Starlink / Satellite</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="contact">How can we contact you? (Optional)</Label>
                        <Input name="contact" id="contact" placeholder="Telegram username or Email" />
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Send className="mr-2 h-4 w-4" />
                                Send Report
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
