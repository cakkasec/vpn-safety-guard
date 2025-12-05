import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

export function SpringSecurityClinic() {
    return (
        <Card className="w-full max-w-3xl mx-auto shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                    <div className="h-8 w-8 text-3xl">🏥</div>
                    Spring Security Clinic
                </CardTitle>
                <CardDescription className="text-lg">
                    ဒစ်ဂျစ်တယ်လုံခြုံရေး ဆေးခန်း
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
                <div className="space-y-4 text-base leading-relaxed">
                    <p className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">🔹</span>
                        <span>ဆေးခန်းပြဖို့ မကြောက်နဲ့၊ ဆေးမမှီမှာသာ စိုးရိမ်ပါဗျို့။</span>
                    </p>
                    <p className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">🔹</span>
                        <span>ကိုယ့်လူတို့ရဲ့ ဒစ်ဂျစ်တယ်လုံခြုံရေးပြဿနာတွေကို ၂၄ နာရီလုံး အခမဲ့ ဖြေရှင်းပေးနေတာမို့ ဆေးခန်းကိုသာ အပြေးလှမ်းလာလိုက်ပါတော့။</span>
                    </p>
                    <p className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">🔻</span>
                        <span>လုံခြုံရေးအတွက် ဘယ်သူမှန်းမသိနိုင်အောင် Telegram ကနေသာမေးခွန်းတွေ လက်ခံပေးနေပါတယ်။</span>
                    </p>
                </div>

                <div className="flex justify-center pt-4">
                    <a
                        href="https://t.me/SpringSecClinic"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors shadow-md hover:shadow-lg"
                    >
                        <ExternalLink className="h-5 w-5" />
                        Telegram ဆေးခန်း သို့သွားရန်
                    </a>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    https://t.me/SpringSecClinic
                </div>
            </CardContent>
        </Card>
    );
}
