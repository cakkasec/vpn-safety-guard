import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { protocol, region, isp, internetType, contact } = body;

        // Google Form URL (formResponse)
        const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfljCctg9O0D0PNF2ts_Obk7QnXkyCTc9F6qU91diTwSK0cig/formResponse';

        // Map fields to Entry IDs
        // Extracted IDs:
        // Protocol: 1535917215
        // Region: 1943863405
        // ISP: 1431149095
        // Internet Type: 722440215
        // Contact: 309637191

        const formData = new URLSearchParams();
        formData.append('entry.1535917215', protocol);
        formData.append('entry.1943863405', region);
        formData.append('entry.1431149095', isp);
        formData.append('entry.722440215', internetType);
        formData.append('entry.309637191', contact || '');

        // Send to Google Forms
        const response = await fetch(FORM_URL, {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        // Google Forms returns a 200 OK even if it's a "Thank you" page HTML.
        // If it fails (e.g. 400), it means validation error.

        if (response.ok) {
            return NextResponse.json({ success: true });
        } else {
            console.error('Google Form submission failed:', response.status, response.statusText);
            return NextResponse.json({ success: false, error: 'Submission failed' }, { status: 500 });
        }

    } catch (error) {
        console.error('Error submitting report:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
