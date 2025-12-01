# Deployment Guide

## 1. Deploy to Vercel (Recommended)

Vercel is the creators of Next.js and the easiest place to deploy this app.

1.  **Push your code to GitHub**.
2.  Go to [Vercel.com](https://vercel.com) and sign up.
3.  Click **"Add New..."** -> **"Project"**.
4.  Import your GitHub repository.
5.  In the **"Environment Variables"** section, add your user credentials:
    - `AUTH_USER`: The username you want (e.g., `admin`)
    - `AUTH_PASS`: The password you want (e.g., `SecretPassword123!`)
6.  Click **"Deploy"**.

## 2. Running Locally

To run locally:

1.  Run `npm run dev`.
