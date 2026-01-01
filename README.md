Here’s a **polished, professional, GitHub-ready README.md** for **AgroVision**, with **clean structure, clear explanations, and meaningful icons (emojis)**—not overused, but visually helpful 🌱

You can **copy–paste this directly** into your repository.

---

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

1. **Sign Up** using email & password
2. **Email Verification** via Supabase
3. **Login** to the platform
4. **Role-Based Dashboard Access**

---

## 🧑‍🌾 User Roles & Permissions

| Role           | Capabilities                                        |
| -------------- | --------------------------------------------------- |
| **Farmer**     | Crop scanning, office search, chat with specialists |
| **Specialist** | Respond to farmers, provide expert advice           |
| **Guest**      | View public info only (no core features)            |

---

## 🛠️ Tech Stack

### Frontend

* ⚛️ **React 19**
* 🟦 **TypeScript**
* 🎨 **Tailwind CSS**
* ⚡ **Vite**

### Backend & Services

* 🗄️ **Supabase** (PostgreSQL, Authentication, Real-time)
* 🤖 **Google Gemini API** (Disease detection & AI chat)
* 🗺️ **OpenStreetMap** + **React Leaflet**

### UI & Icons

* 🎯 **Lucide React**

---

## ⚙️ Setup & Installation

### ✅ Prerequisites

* **Node.js** v18 or higher
* A **Supabase account**

---

### 📥 1. Clone the Repository

```bash
git clone <repository-url>
cd agrovision
npm install
```

---

### 🗃️ 2. Supabase Configuration (Required)

⚠️ **Important:** Registration and authentication will not work without Supabase setup.

1. Create a new project at **supabase.com**
2. Go to **Settings → API**
3. Copy:

   * Project URL
   * Anon Public Key
4. Open **Supabase SQL Editor**
5. Run the SQL from `database_setup.sql`

📘 **Detailed Guide:**
See 👉 `SUPABASE_SETUP.md` for step-by-step instructions.

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

The platform uses the following core tables:

* **profiles** → User details (name, role, contact info)
* **scans** → Crop disease scan history
* **messages** → Real-time chat messages

---

## 🤝 Contributing

We welcome contributions! 🚀

1. Fork the repository
2. Create a new feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📜 License

This project is licensed under the **MIT License**.
You are free to use, modify, and distribute it.

---

## 🌱 Vision

**AgroVision aims to bridge the gap between farmers and technology**, empowering agriculture in Bangladesh through AI, accessibility, and expert collaboration.

<img width="1906" height="901" alt="Screenshot 2026-01-01 064910" src="https://github.com/user-attachments/assets/4b908656-f6b0-4dc1-b8bc-7a9cd0133c2b" />
<img width="1919" height="830" alt="Screenshot 2026-01-01 084016" src="https://github.com/user-attachments/assets/cb08be34-bd15-4704-a90f-daa80377cc52" />
<img width="1770" height="1033" alt="Screenshot 2026-01-01 083731" src="https://github.com/user-attachments/assets/430f0924-d4b5-4113-bb0d-b7befcf51180" />
<img width="1281" height="1022" alt="Screenshot 2026-01-01 083759" src="https://github.com/user-attachments/assets/4d265a9b-8c80-46a7-a331-0ebf1adf96c5" />
<img width="1770" height="843" alt="Screenshot 2026-01-01 083823" src="https://github.com/user-attachments/assets/cfa04f4b-2392-4ab2-afb4-7ff9a757e9a7" />
<img width="1140" height="855" alt="Screenshot 2026-01-01 083914" src="https://github.com/user-attachments/assets/e4412f68-acaa-4a62-b568-de2009115e23" />
<img width="1309" height="884" alt="Screenshot 2026-01-01 083934" src="https://github.com/user-attachments/assets/613e8077-be25-4064-9eb8-f32ea6741418" />










