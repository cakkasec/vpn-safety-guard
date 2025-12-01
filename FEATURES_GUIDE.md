# VPN Safety Guard - Features & Testing Guide

**Project Goal**: To provide a secure, easy-to-use tool for people in Myanmar to verify their VPN security and bypass censorship.

## 🌟 Key Features to Test

### 1. Dashboard & IP Detection
*   **What it does**: Automatically detects your Public IP, Location (City/Country), and ISP.
*   **Why it matters**: If it shows "Myanmar" or your local ISP (e.g., MPT, Atom) while your VPN is ON, your VPN is **not working**.
*   **What to test**:
    *   Turn on your VPN.
    *   Does the location match your VPN server (e.g., Singapore)?
    *   Does the map show the correct area?

### 2. WebRTC Leak Test
*   **What it does**: Checks if your real IP is leaking through your browser's WebRTC feature (often used for video chat).
*   **Why it matters**: Even if your VPN is on, WebRTC can reveal your real IP to websites.
*   **What to test**:
    *   Look for the "WebRTC Status" card.
    *   **Safe**: Shows the same IP as your VPN or "No Leak".
    *   **Leak**: Shows your real Myanmar IP.

### 3. Censorship Check (DPI Bypass)
*   **What it does**: Tries to connect to blocked websites (Facebook, YouTube, The Irrawaddy, Twitter) to see if your VPN can bypass the military's blocking (DPI).
*   **Why it matters**: Verifies if your VPN protocol (e.g., WireGuard, V2Ray) is actually effective against censorship.
*   **What to test**:
    *   Click **"Run Connectivity Test"**.
    *   **Green (Accessible)**: Good! Your VPN is bypassing the block.
    *   **Red (Blocked)**: Your VPN might be detected or blocked.

### 4. OONI Myanmar Status
*   **What it does**: Shows real-time network measurement data from OONI (Open Observatory of Network Interference).
*   **Why it matters**: Gives a big-picture view of internet censorship in Myanmar.
*   **What to test**:
    *   Check if the numbers (Measurements, Networks) load.
    *   Click "View Full OONI Report" to see if the link works.

### 5. VPN Knowledge Base (Analyzer Tab)
*   **What it does**: A searchable database of VPN apps with safety ratings (Safe, Caution, Unsafe).
*   **Why it matters**: Many free VPNs are dangerous (log data, contain trackers). This helps users choose safe tools.
*   **What to test**:
    *   Go to the **"Analyzer"** tab.
    *   Search for a VPN (e.g., "Psiphon", "Mullvad", "Secure VPN").
    *   Read the "Cyber Guardian" advice.

### 6. Safety Guide (Burmese Content)
*   **What it does**: Provides essential safety tips and recommended tools in English and Burmese.
*   **Why it matters**: Education is as important as tools.
*   **What to test**:
    *   Go to the **"Safety Guide"** tab.
    *   Check the **"Spring Security Clinic"** section.
    *   Is the Burmese text readable and accurate?
    *   Do the links (Telegram, Engage Media) work?

---

## 📝 Feedback Questions for Testers

Please ask your friends these questions:

1.  **Ease of Use**: Was the app easy to understand? Did you know what to do immediately?
2.  **Speed**: Did the IP check and Censorship test load quickly?
3.  **Accuracy**: Did the "Public IP" correctly show your VPN location?
4.  **Language**: Is the Burmese text in the Safety Guide natural and correct?
5.  **Bugs**: Did you see any errors or blank screens?
6.  **Suggestions**: What one feature would make this more useful for you?

---

*You can copy and paste this text into a Google Doc to share with your team!*
