'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, CheckCircle2, Send } from 'lucide-react';

export function ReportIssue() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoading(false);
        setSubmitted(true);
        // In a real app, this would send data to a backend or Google Sheet
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
                        <Select required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Protocol" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="wireguard">WireGuard</SelectItem>
                                <SelectItem value="openvpn">OpenVPN (TCP/UDP)</SelectItem>
                                <SelectItem value="v2ray">V2Ray (VMess/VLESS)</SelectItem>
                                <SelectItem value="shadowsocks">Shadowsocks</SelectItem>
                                <SelectItem value="psiphon">Psiphon</SelectItem>
                                <SelectItem value="ikev2">IKEv2 / IPsec</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="region">What region are you in?</Label>
                        <Select required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select State/Region" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="yangon">Yangon</SelectItem>
                                <SelectItem value="mandalay">Mandalay</SelectItem>
                                <SelectItem value="naypyidaw">Naypyidaw</SelectItem>
                                <SelectItem value="shan">Shan State</SelectItem>
                                <SelectItem value="kachin">Kachin State</SelectItem>
                                <SelectItem value="karen">Karen State</SelectItem>
                                <SelectItem value="rakhine">Rakhine State</SelectItem>
                                <SelectItem value="mon">Mon State</SelectItem>
                                <SelectItem value="bago">Bago</SelectItem>
                                <SelectItem value="sagaing">Sagaing</SelectItem>
                                <SelectItem value="magway">Magway</SelectItem>
                                <SelectItem value="ayeyarwady">Ayeyarwady</SelectItem>
                                <SelectItem value="tanintharyi">Tanintharyi</SelectItem>
                                <SelectItem value="chin">Chin State</SelectItem>
                                <SelectItem value="kayah">Kayah State</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="isp">What is your ISP?</Label>
                        <Select required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select ISP" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="mpt">MPT (Mobile/Fiber)</SelectItem>
                                <SelectItem value="atom">Atom (Telenor)</SelectItem>
                                <SelectItem value="ooredoo">Ooredoo</SelectItem>
                                <SelectItem value="mytel">Mytel</SelectItem>
                                <SelectItem value="globalnet">GlobalNet</SelectItem>
                                <SelectItem value="5bb">5BB Broadband</SelectItem>
                                <SelectItem value="unilink">Unilink</SelectItem>
                                <SelectItem value="myanmarnet">Myanmar Net</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="connection">Internet Type</Label>
                        <Select required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Connection Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="mobile">Mobile Data</SelectItem>
                                <SelectItem value="fiber">WiFi / Fiber</SelectItem>
                                <SelectItem value="satellite">Starlink / Satellite</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="contact">How can we contact you? (Optional)</Label>
                        <Input id="contact" placeholder="Telegram username or Email" />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Sending...' : (
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
