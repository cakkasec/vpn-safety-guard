'use client';

import { LeakTest } from '@/components/LeakTest';
import { ProtocolAnalyzer } from '@/components/ProtocolAnalyzer';
import { SafetyGuide } from '@/components/SafetyGuide';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShieldCheck } from 'lucide-react';

import { VPNKnowledgeBase } from '@/components/VPNKnowledgeBase';
import { CensorshipCheck } from '@/components/CensorshipCheck';
import { OONIStatus } from '@/components/OONIStatus';
import { ReportIssue } from '@/components/ReportIssue';
import { CommunityDashboard } from '@/components/CommunityDashboard';
import { VisitorCounter } from '@/components/VisitorCounter';

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex items-center justify-between pb-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">VPN Safety Guard</h1>
              <p className="text-muted-foreground">Security analysis tool for Myanmar</p>
            </div>
          </div>
          <VisitorCounter />
        </header>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="analyzer">Analyzer</TabsTrigger>
            <TabsTrigger value="guide">Safety Guide</TabsTrigger>
          </TabsList>

          {/* ... inside Home component ... */}

          {/* ... inside Home component ... */}

          <TabsContent value="dashboard" className="space-y-6 animate-in fade-in-50">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Top Row: Leak Test (Full Width) */}
              <div className="md:col-span-2">
                <LeakTest />
              </div>

              {/* Middle Row: Censorship Check & OONI Status (Side by Side) */}
              <div className="md:col-span-1">
                <CensorshipCheck />
              </div>
              <div className="md:col-span-1">
                <OONIStatus />
              </div>

              {/* Middle Row: App Integrity Check (Full Width) */}
              <div className="md:col-span-2">
                <VPNKnowledgeBase />
              </div>

              {/* Bottom Row: Community Dashboard (Full Width) */}
              <div className="md:col-span-2">
                <CommunityDashboard />
              </div>
            </div>
          </TabsContent>

          {/* ... inside Home component ... */}

          <TabsContent value="analyzer" className="animate-in fade-in-50">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2">
                <VPNKnowledgeBase />
              </div>
              <div className="md:col-span-1 space-y-6">
                <ProtocolAnalyzer />
                <ReportIssue />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="guide" className="animate-in fade-in-50">
            <SafetyGuide />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
