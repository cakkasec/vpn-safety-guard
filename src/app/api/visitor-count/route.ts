import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DATA_FILE = path.join(process.cwd(), 'data', 'visitors.json');

interface VisitorData {
    count: number;
    hashes: string[];
}

// Helper to get IP
function getIP(req: Request) {
    const forwarded = req.headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0];
    }
    return '127.0.0.1';
}

// Helper to hash IP
function hashIP(ip: string) {
    return crypto.createHash('sha256').update(ip).digest('hex');
}

// Helper to get simulated count
function getSimulatedCount() {
    const start = 1733011200000; // Dec 1, 2024
    const now = Date.now();
    // Base 500 + 1 visitor every 15 minutes
    return 500 + Math.floor((now - start) / (15 * 60 * 1000));
}

export async function GET(req: Request) {
    let data: VisitorData = { count: 0, hashes: [] };

    try {
        if (fs.existsSync(DATA_FILE)) {
            const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
            data = JSON.parse(fileContent);
        }
    } catch (error) {
        console.error('Error reading visitor data:', error);
    }

    // For showcase: return max of real or simulated
    return NextResponse.json({ count: Math.max(data.count, getSimulatedCount()) });
}

export async function POST(req: Request) {
    const ip = getIP(req);
    const hash = hashIP(ip);

    let data: VisitorData = { count: 0, hashes: [] };

    try {
        if (fs.existsSync(DATA_FILE)) {
            const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
            data = JSON.parse(fileContent);
        }
    } catch (readError) {
        console.warn('Could not read visitor data (expected in serverless):', readError);
        // Continue with empty data
    }

    try {
        // Check if unique
        if (!data.hashes.includes(hash)) {
            data.hashes.push(hash);
            data.count++;

            // Write back
            // Note: In Vercel serverless, this file write is ephemeral and won't persist permanently.
            // For a real production app, use a database (Postgres, Redis, etc.).
            try {
                // Ensure directory exists
                const dir = path.dirname(DATA_FILE);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
                fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
            } catch (writeError) {
                console.warn('Could not write visitor data:', writeError);
                // Ignore write error, just return the incremented count for this session
            }
        }

        // For showcase: return max of real or simulated
        return NextResponse.json({
            count: Math.max(data.count, getSimulatedCount()),
            new: !data.hashes.includes(hash)
        });
    } catch (error) {
        console.error('Error updating visitor data:', error);

        return NextResponse.json({ count: getSimulatedCount() }, { status: 200 });
    }
}
