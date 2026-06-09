# Deploying Backend to cPanel

This guide explains how to deploy your Node.js/Express backend to cPanel using the "Setup Node.js App" feature.

## Prerequisites

1.  **cPanel Access**: Ensure your hosting provider supports Node.js via cPanel.
2.  **Domain/Subdomain**: Decide where your API will live (e.g., `api.yourdomain.com`).

## Step 1: Prepare Files

We have already prepared an `app.js` file in the root of your `backend` folder. This file points to the compiled code in the `dist` folder.

1.  **Do NOT upload `node_modules`**: It is best practice to install dependencies on the server.
2.  **Zip the `backend` folder contents**: Select all files inside `backend` EXCEPT `node_modules`, and compress them into a `.zip` file.
    *   Include: `app.js`, `package.json`, `dist/`, `.env` (optional, better to set in cPanel), `public/` (if any).

## Step 2: Upload to cPanel

1.  Log in to cPanel.
2.  Go to **File Manager**.
3.  Navigate to the directory effectively serving as your application root (e.g., `public_html/api` or creates a new folder `backend` in the root).
4.  **Upload** your `.zip` file.
5.  **Extract** the zip file.

## Step 3: Setup Node.js App

1.  Go to the cPanel main dashboard and find **"Setup Node.js App"**.
2.  Click **"Create Application"**.
3.  Fill in the details:
    *   **Node.js Version**: Select the latest stable version (e.g., `20.x` or `22.x`).
    *   **Application Mode**: `Production`.
    *   **Application Root**: The path to the folder where you extracted your files (e.g., `backend`).
    *   **Application URL**: The public URL for your API (e.g., `api.yourdomain.com`).
    *   **Application Startup File**: `app.js` (This is crucial! Do not leave blank or set to `index.js` unless that is what you uploaded).
4.  Click **Create**.

## Step 4: Install Dependencies

1.  Once the app is created, scroll down to the "Detected Configuration File" section.
2.  It should detect `package.json`.
3.  Click the **"Run NPM Install"** button.
    *   *Note: If this button is missing, you may need to connect via SSH and run `npm install` manually in the application root.*

## Step 5: Environment Variables

1.  In the "Setup Node.js App" page, look for the **"Environment Variables"** section.
2.  Click **"Add Variable"** and add the variables from your `.env` file:
    *   `MONGODB_URI`: Your production MongoDB connection string.
    *   `JWT_SECRET`: Your secret key.
    *   `PORT`: (Optional, cPanel usually handles this, but setting it to `3000` or letting it default is fine).
    *   Add any other variables your app needs.

## Step 6: Restart

1.  Click the **"Restart Application"** button.
2.  Visit your Application URL to verifying it is running.

## Troubleshooting

-   **500/503 Errors**: Check the `stderr.log` in your application root folder for detailed error messages.
-   **"App Not Started"**: Ensure `app.js` correctly points to `./dist/index.js` and that users have read permissions.
