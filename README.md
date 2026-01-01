# 🌾 AgroVision — AI Crop Disease Detection Platform

**AgroVision** is an AI-powered agricultural assistance platform designed for **farmers and agricultural specialists in Bangladesh**.
It combines **crop disease detection**, **location-based agricultural services**, and **real-time expert communication** to support smarter and faster farming decisions.

---

## ✨ Key Features

🌿 **AI Crop Disease Detection**
Upload or capture crop leaf images to instantly detect diseases using AI analysis.

📍 **Location-Based Agricultural Office Finder**
Find nearby agricultural offices with accurate distance calculation using maps.

💬 **Real-Time Chat Support**
Farmers can directly chat with agricultural specialists for expert guidance.

🌐 **Multi-language Support**
Available in **English 🇬🇧** and **Bengali 🇧🇩** for better accessibility.

👤 **Role-Based Authentication**
Separate dashboards and permissions for:

* Farmers
* Agricultural Specialists

📱 **Responsive Design**
Fully optimized for desktop, tablet, and mobile devices.

---

## 🔐 User Registration & Authentication

Users can register as either **Farmers** or **Agricultural Specialists**.

### 🧾 Required Information

* **Full Name**
* **Email Address** (used for authentication)
* **Password** (minimum 6 characters)
* **Role** (Farmer or Specialist)

### 🔄 Authentication Flow

1. Sign up using email & password
2. Email verification via Supabase
3. Login to the platform
4. Role-based dashboard access

---

## 🧑‍🌾 User Roles & Permissions

| Role           | Capabilities                                        |
| -------------- | --------------------------------------------------- |
| **Farmer**     | Crop scanning, office search, chat with specialists |
| **Specialist** | Respond to farmers, provide expert advice           |
| **Guest**      | View public information only                        |

---

## 🛠️ Tech Stack

### Frontend

* ⚛️ React 19
* 🟦 TypeScript
* 🎨 Tailwind CSS
* ⚡ Vite

### Backend & Services

* 🗄️ Supabase (PostgreSQL, Authentication, Real-time)
* 🤖 Google Gemini API (Disease detection & AI chat)
* 🗺️ OpenStreetMap + React Leaflet

### UI & Icons

* 🎯 Lucide React

---

## ⚙️ Setup & Installation

### ✅ Prerequisites

* Node.js v18 or higher
* A Supabase account

---

### 📥 1. Clone the Repository

```bash
git clone https://github.com/AitijyaSarker/MXB2026-Sylhet-Neural-Nodes-AgroVision.git
cd AgroVision
npm install
```

---

### 🗃️ 2. Supabase Configuration (Required)

⚠️ **Important:** Registration and authentication will not work without Supabase setup.

1. Create a new project at **supabase.com**
2. Go to **Settings → API**
3. Copy the **Project URL** and **Anon Public Key**
4. Open **Supabase SQL Editor**
5. Run the SQL from `database_setup.sql`

📘 See `SUPABASE_SETUP.md` for step-by-step instructions.

---

### 🔑 3. Environment Variables

Create a `.env.local` file in the project root:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

---

### ▶️ 4. Run the Application

```bash
npm run dev
```

🌐 Application will be available at:
**[http://localhost:3010](http://localhost:3010)**

---

## 🧩 Database Schema Overview

* **profiles** → User details (name, role, contact info)
* **scans** → Crop disease scan history
* **messages** → Real-time chat messages

---

## 🤝 Contributing

We welcome contributions!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 🌱 Vision

**AgroVision aims to bridge the gap between farmers and technology**, empowering agriculture in Bangladesh through AI, accessibility, and expert collaboration.

---

## 🔗 Project Resources

### 📂 Project Drive

Datasets, documents, and assets:

👉 [https://drive.google.com/drive/folders/1-L9Xf2lS2GK6mPM4zxnK8FaT0LmhUOjC?usp=sharing](https://drive.google.com/drive/folders/1-L9Xf2lS2GK6mPM4zxnK8FaT0LmhUOjC?usp=sharing)

---

### 🎥 Project Demo Video

👉 [https://youtu.be/ic_0TmDpWyw](https://youtu.be/ic_0TmDpWyw)
