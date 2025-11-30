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

## 2. Managing Users

### Single User (Simple)
Set `AUTH_USER` and `AUTH_PASS` in Vercel Environment Variables.

### Multiple Users (Advanced)
To add multiple users, add a new Environment Variable called `AUTH_USERS`.
**Format**: `username:password,username2:password2`

**Example**:
`AUTH_USERS` = `alice:secret123,bob:secure456`

(Note: Use a comma `,` to separate users and a colon `:` to separate username and password).

## 3. Running Locally

To run locally with authentication:

1.  Create a `.env.local` file in the project root:
    ```bash
    AUTH_USER=admin
    AUTH_PASS=password123
    ```
2.  Run `npm run dev`.
