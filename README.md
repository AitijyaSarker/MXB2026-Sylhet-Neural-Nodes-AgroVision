# AgroVision - AI Crop Disease Detection

An AI-powered agricultural assistance app for farmers and specialists in Bangladesh, featuring crop disease detection, location-based agricultural office finder, and real-time chat support.

## Features

- **Crop Disease Detection**: Upload or capture leaf photos for AI-powered disease analysis
- **Location Services**: Find nearby agricultural offices with distance calculations
- **Multi-language Support**: English and Bengali language options
- **User Authentication**: Separate accounts for farmers and agricultural specialists
- **Real-time Chat**: Connect farmers with specialists for expert advice
- **Responsive Design**: Works on desktop and mobile devices

## User Registration & Authentication

Users can register as either **Farmers** or **Agricultural Specialists** using:
- **Name**: Full name
- **Email**: Valid email address (used for authentication)
- **Password**: Minimum 6 characters
- **Role**: Farmer or Specialist

### Authentication Flow:
1. **Registration**: New users create account with email/password
2. **Email Verification**: Supabase sends confirmation email
3. **Login**: Users login with email/password
4. **Role-based Access**: Different dashboards for farmers vs specialists

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Vite
- **Mapping**: OpenStreetMap with React Leaflet
- **AI**: Google Gemini API for disease detection and chat
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **Icons**: Lucide React

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- A Supabase account

### 1. Clone and Install

```bash
git clone <repository-url>
cd agrovision
npm install
```

### 2. Supabase Setup

**⚠️ IMPORTANT**: You must set up Supabase before the registration system will work!

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Copy the SQL from `database_setup.sql` and run it in your Supabase SQL Editor

**📖 Detailed Setup Guide**: See [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for step-by-step instructions.

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Run the Application

```bash
npm run dev
```

The app will be available at `http://localhost:3010`

## Database Schema

The app uses the following main tables:

- **profiles**: User profiles with name, mobile, role (farmer/specialist)
- **scans**: Disease detection scan history
- **messages**: Chat messages between farmers and specialists

## User Roles

- **Farmer**: Can scan crops, view nearby offices, chat with specialists
- **Specialist**: Can respond to farmer queries, provide expert advice
- **Guest**: Limited access, can view information but not use core features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
