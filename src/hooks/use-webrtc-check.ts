import { useState, useEffect } from 'react';

export function useWebRTCCheck() {
    const [leakedIPs, setLeakedIPs] = useState<string[]>([]);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const checkWebRTC = async () => {
            setChecking(true);
            const ips = new Set<string>();

            try {
                const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });

                pc.createDataChannel('');

                pc.onicecandidate = (e) => {
                    if (!e.candidate) {
                        setChecking(false);
                        return;
                    }

                    const candidate = e.candidate.candidate;
                    // Regex to extract IP addresses
                    const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/;
                    const match = candidate.match(ipRegex);

                    if (match) {
                        const ip = match[1];
                        // Filter out local IPs (192.168.x.x, 10.x.x.x, 172.16.x.x) if needed, 
                        // but showing them can be useful for debugging. 
                        // For security check, we mostly care about public IPs that differ from the VPN IP.
                        if (!ips.has(ip)) {
                            ips.add(ip);
                            setLeakedIPs(Array.from(ips));
                        }
                    }
                };

                await pc.setLocalDescription(await pc.createOffer());

                // Timeout to stop checking after a few seconds
                setTimeout(() => {
                    pc.close();
                    setChecking(false);
                }, 5000);

            } catch (err) {
                console.error('WebRTC check failed:', err);
                setChecking(false);
            }
        };

        checkWebRTC();
    }, []);

    return { leakedIPs, checking };
}
