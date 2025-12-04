import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';

export function VisitorCounter() {
    const [count, setCount] = useState<number | null>(null);

    useEffect(() => {
        const trackVisitor = async () => {
            try {
                // POST to track visit
                const res = await fetch('/api/visitor-count', { method: 'POST' });
                const data = await res.json();
                setCount(data.count);
            } catch (error) {
                console.error('Failed to track visitor', error);
            }
        };

        trackVisitor();
    }, []);

    if (count === null) return null;

    return (
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-3 py-1 rounded-full border border-border/50">
            <Users className="h-3 w-3" />
            <span>{count.toLocaleString()} Visitors Protected</span>
        </div>
    );
}
