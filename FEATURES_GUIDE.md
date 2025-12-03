# VPN Safety Guard - Features & Testing Guide

**Project Goal**: To provide a secure, easy-to-use tool for people in Myanmar to verify their VPN security and bypass censorship.

## 🌟 Key Features to Test

### 1. Community Dashboard (New!)
*   **What it does**: Shows real-time VPN blocking status crowdsourced from users across Myanmar.
*   **Why it matters**: Helps users quickly see which ISPs are blocking which protocols (e.g., "Is Atom blocking WireGuard?").
*   **What to test**:
    *   Go to the **"Dashboard"** tab.
    *   Check the **Matrix View** (ISPs vs Protocols).
    *   **Green Check**: Working. **Red X**: Blocked.
    *   Try filtering by **Region** (e.g., Yangon, Mandalay).
    *   Verify the **Bilingual Description** (English & Myanmar).

### 2. App Integrity Check (Analyzer Tab)
*   **What it does**: A searchable database of VPN apps that checks for security risks.
*   **Data Source**: Now connected live to the **"Free Android VPN Security Risks" Google Sheet**.
*   **Why it matters**: Many free VPNs are dangerous. This tool checks for:
    *   **Encryption**: Is user data encrypted?
    *   **Leaks**: Does it leak IP, DNS, or WebRTC?
*   **What to test**:
    *   Go to the **"Analyzer"** tab.
    *   Search for apps like "Secure VPN", "Turbo VPN", or "VPN Satoshi".
    *   Verify the **Risk Level** (Safe, Caution, Unsafe) matches the sheet data.
    *   Check the **Myanmar Translation** for the search instruction.

### 3. WebRTC Leak Test
*   **What it does**: Checks if your real IP is leaking through your browser's WebRTC feature.
*   **Why it matters**: Even if your VPN is on, WebRTC can reveal your real IP to websites.
*   **What to test**:
    *   Look for the "WebRTC Leak Test" card on the Dashboard.
    *   **Safe**: Shows the same IP as your VPN or "No Leak".
    *   **Leak**: Shows your real Myanmar IP.
    *   **New Warning**: If a leak is found, check the instruction: *"Change WebRTC IP handling policy to 'Disable non-proxied UDP'"*.

### 4. Censorship Check (DPI Bypass)
*   **What it does**: Tries to connect to blocked websites (Facebook, YouTube, The Irrawaddy, Twitter) to see if your VPN can bypass the military's blocking (DPI).
*   **Why it matters**: Verifies if your VPN protocol (e.g., WireGuard, V2Ray) is actually effective against censorship.
*   **What to test**:
    *   Click **"Run Connectivity Test"**.
    *   **Green (Accessible)**: Good! Your VPN is bypassing the block.
    *   **Red (Blocked)**: Your VPN might be detected or blocked.

### 5. Report VPN Issues
*   **What it does**: Allows users to report when a VPN protocol is blocked in their area.
*   **Why it matters**: Crowdsources data for the Community Dashboard.
*   **What to test**:
    *   Go to the **"Analyzer"** tab.
    *   Fill out the **"Report VPN Issues"** form.
    *   Submit a report and verify it says "Report Submitted".

### 6. Safety Guide (Burmese Content)
*   **What it does**: Provides essential safety tips and recommended tools in English and Burmese.
*   **Why it matters**: Education is as important as tools.
*   **What to test**:
    *   Go to the **"Safety Guide"** tab.
    *   Check the **"Spring Security Clinic"** section.
    *   Is the Burmese text readable and accurate?

---

## 📝 Feedback Questions for Testers

Please ask your friends these questions:

1.  **Ease of Use**: Was the app easy to understand? Did you know what to do immediately?
2.  **Dashboard**: Is the Community Dashboard easy to read? Does the Myanmar text help?
3.  **Accuracy**: Did the "App Integrity Check" correctly identify risky apps?
4.  **Language**: Is the Burmese text in the Safety Guide and Dashboard natural and correct?
5.  **Bugs**: Did you see any errors or blank screens?
6.  **Suggestions**: What one feature would make this more useful for you?

---

*You can copy and paste this text into a Google Doc to share with your team!*
