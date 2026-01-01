# Supabase Setup Guide

## 🚨 Critical: You must complete these steps before registration will work!

### Step 1: Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/Login to your account
3. Click "New Project"
4. Fill in your project details:
   - Name: `AgroVision` (or any name you prefer)
   - Database Password: Choose a strong password
   - Region: Select the closest region to you
5. Click "Create new project"
6. Wait for the project to be fully initialized (this may take a few minutes)

### Step 2: Get Your Project Credentials
1. In your Supabase dashboard, go to **Settings** (gear icon) → **API**
2. Copy the following values:
   - **Project URL**: Something like `https://abcdefghijklmnop.supabase.co`
   - **anon/public key**: A long JWT token starting with `eyJ...`

### Step 3: Update Environment Variables
1. Open the `.env.local` file in your project root
2. Replace the placeholder values:
   ```
   SUPABASE_URL=https://your-actual-project-id.supabase.co
   SUPABASE_ANON_KEY=your-actual-anon-key-here
   ```
   With your real values from Step 2.

### Step 4: Set Up Database Tables
1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the entire contents of `database_setup.sql` from your project
3. Paste it into the SQL Editor
4. Click **Run** to execute the SQL

### Step 5: Test the Setup
1. Restart your development server: `npm run dev`
2. Try registering a new account with your email
3. The registration should now work without the "Failed to fetch" errors

## Troubleshooting

### Still getting "Failed to fetch" errors?
- Double-check that your `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correct
- Make sure there are no extra spaces or characters in the `.env.local` file
- Try restarting your development server after updating the environment variables

### Database errors?
- Make sure you ran the `database_setup.sql` script in the SQL Editor
- Check that all tables were created successfully in the **Table Editor**

### Registration not working?
- Email authentication is enabled by default in Supabase
- Make sure you're using a valid email address
- Check that the profiles table was created with the correct email column

## Need Help?
If you're still having issues, check the Supabase documentation or create an issue in the project repository.