import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AlertTriangle, Eye, Smartphone, Wifi } from 'lucide-react';

export function SafetyGuide() {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>Digital Safety in Myanmar</CardTitle>
                    <CardDescription>Essential checklist for staying safe online under surveillance.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                    Kill Switch is Mandatory
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                Always enable the "Kill Switch" feature in your VPN settings. This ensures that if your VPN connection drops, your internet is cut off immediately, preventing your real IP from leaking to the ISP.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2">
                                    <Eye className="h-4 w-4 text-blue-500" />
                                    Avoid Standard Protocols
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                Standard protocols like OpenVPN (UDP/TCP) and IKEv2 are easily detected by the military's Deep Packet Inspection (DPI) equipment. Use protocols designed for obfuscation like <strong>V2Ray (VMess/VLESS)</strong>, <strong>Shadowsocks</strong>, or <strong>Trojan</strong>.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2">
                                    <Smartphone className="h-4 w-4 text-green-500" />
                                    Mobile Data Safety
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                Mobile operators (MPT, Atom, Ooredoo, Mytel) are under strict junta control. They log SMS and location data. Use Signal or Telegram (with hidden number) for communication. Avoid regular SMS for sensitive OTPs if possible.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2">
                                    <Wifi className="h-4 w-4 text-purple-500" />
                                    Public Wi-Fi Risks
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                Never use public Wi-Fi (cafes, hotels) without a VPN. These networks are often monitored. If your VPN fails to connect on public Wi-Fi, do not proceed with sensitive activities.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-5">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 text-pink-500">🏥</div>
                                    Spring Security Clinic
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4">
                                <p className="font-medium text-primary">ဒစ်ဂျစ်တယ်လုံခြုံရေး ဆေးခန်း</p>
                                <p>🔹ဆေးခန်းပြဖို့ မကြောက်နဲ့၊ ဆေးမမှီမှာသာ စိုးရိမ်ပါဗျို့။</p>
                                <p>🔹 ကိုယ့်လူတို့ရဲ့ ဒစ်ဂျစ်တယ်လုံခြုံရေးပြဿနာတွေကို ၂၄ နာရီလုံး အခမဲ့ ဖြေရှင်းပေးနေတာမို့ ဆေးခန်းကိုသာ အပြေးလှမ်းလာလိုက်ပါတော့။</p>
                                <p>🔻လုံခြုံရေးအတွက် ဘယ်သူမှန်းမသိနိုင်အောင် Telegram ကနေသာမေးခွန်းတွေ လက်ခံပေးနေပါတယ်။</p>
                                <div className="pt-2">
                                    <a
                                        href="https://t.me/SpringSecClinic"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-blue-400 hover:underline"
                                    >
                                        🏪 Telegram ဆေးခန်း အကောင့် - https://t.me/SpringSecClinic
                                    </a>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Recommended Tools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>
                            <strong>Outline VPN</strong>: Easy to set up your own server. Hard to detect.
                            <br />
                            <a href="https://engagemedia.org/2025/drapacvpn/" target="_blank" rel="noopener noreferrer" className="text-xs underline text-primary hover:text-primary/80">
                                Engage Media provides VPNs for human rights defenders
                            </a>
                        </li>
                        <li><strong>Orbot (Tor)</strong>: High anonymity, use with Bridges.</li>
                        <li><strong>v2rayNG / V2Box</strong>: Best for advanced users using V2Ray.</li>
                        <li><strong>Signal</strong>: For encrypted messaging.</li>
                    </ul>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Emergency Steps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">If you suspect your device is compromised or you are in immediate danger:</p>
                    <ol className="list-decimal list-inside space-y-2 text-sm font-medium">
                        <li>Power off the device immediately.</li>
                        <li>Remove the SIM card.</li>
                        <li>Do not use biometrics (fingerprint/face) to unlock.</li>
                    </ol>
                </CardContent>
            </Card>
        </div>
    );
}
