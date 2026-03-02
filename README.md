# 🛡️ ONE STOP ALM Administration

> A full-stack web application to automate ALM administration tasks — built with React, Python Flask, and OpenText ALM OTA API.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-00e5ff?style=for-the-badge&logo=vercel&logoColor=black)](https://one-stop-alm-administration.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Local%20via%20start.bat-e03030?style=for-the-badge&logo=windows&logoColor=white)](#-local-setup)
[![Python](https://img.shields.io/badge/Python-3.14-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![React](https://img.shields.io/badge/React-TypeScript-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)

---

## 🚀 Live Application

**🔗 https://one-stop-alm-administration.vercel.app**

> Click **"DEMO ACCESS (Preview Mode)"** to explore all features without an ALM connection.

---

## 📌 Overview

Managing ALM administration tasks across multiple tools is time-consuming and error-prone. This application consolidates **8 core ALM utilities** into a single, clean web interface with a real-time execution console.

Built by an RPA Developer with 4+ years of ALM experience — including ALM v16 → v24 upgrade management.

---

## ✨ Features

### 8 Utility Modules

| Module | Description |
|---|---|
| 🔐 **User Access Management** | LDAP-based user provisioning, site admin assignment, project group management |
| 📋 **Test Case Extraction** | Extract from Test Plan folders or Test Set IDs — with or without attachments |
| 📄 **Evidence Generator** | Auto-generate Word documents per tester from ALM run data |
| 🔄 **Test Type Update** | Bulk update test types (MANUAL, QUICKTEST, BUSINESS-PROCESS, etc.) |
| 🐛 **Defect Extraction** | Extract defects with Status, Priority, Severity, Category filters |
| 📎 **Attachment Downloader** | Download run-level and step-level attachments for specific or all test sets |
| 📧 **Maintenance Notification** | Send maintenance window emails to all project users via Outlook |
| 📊 **Operations Dashboard** | Real-time execution history, system health, quick actions |

### Three Operating Modes

| Mode | When | How |
|---|---|---|
| 🟢 **Live Mode** | Windows machine with ALM client + `start.bat` running | OTA API (`TDApiOle80`) auto-detected |
| 🔵 **Default Mode** | `start.bat` running, no ALM client installed | Backend responds with realistic demo data |
| 🟡 **Demo Mode** | No backend, any machine/browser | Fully simulated responses, no setup required |

---

## 🛠️ Tech Stack

**Frontend**
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Shadcn/ui components
- Deployed on **Vercel**

**Backend**
- Python 3.14
- Flask 3.0 REST API
- Flask-CORS
- Runs locally via `start.bat` (Windows)

**ALM Integration**
- OpenText ALM 24.x
- OTA API (`TDApiOle80`) via `win32com.client`
- Single COM thread — `tdc` shared across all 8 utilities

---

## 🏗️ Architecture

```
Browser (Vercel)
      │
      ▼
React Frontend ──────► Flask REST API (localhost:8000)
                              │
                    ┌─────────┴──────────┐
                    │                    │
              OTA Available?         Demo Mode
              (Windows + ALM)       (No ALM client)
                    │                    │
                    ▼                    ▼
            Real ALM Server       Dummy Responses
           (TDApiOle80 COM)       (Realistic Data)
```

> **Note:** The backend uses Windows COM (`win32com`) to interface with the ALM OTA API.
> This requires running on a Windows machine — cloud hosting (Linux) runs in Demo mode only.

---

## 🖥️ Local Setup

### Prerequisites
- Python 3.8+
- Node.js 18+
- Git
- Windows OS (for Live ALM mode)

### 1. Clone the repository

```bash
git clone https://github.com/pongowthamkumar4209-svg/One_Stop_ALM_Administration.git
cd One_Stop_ALM_Administration
```

### 2. Start the Flask backend

```bash
# Option A — double-click start.bat (recommended)
start.bat

# Option B — manual
pip install flask flask-cors openpyxl pandas beautifulsoup4 python-docx
python backend/app.py
# → Running on http://localhost:8000
```

### 3. Start the React frontend

```bash
npm install
npm run dev
# → Running on http://localhost:8080
```

### 4. Open in browser

```
http://localhost:8080

# Or use the Vercel deployment (backend must still be running locally)
https://one-stop-alm-administration.vercel.app
```

> **For Real ALM Mode:** Run on a Windows machine with OpenText ALM client installed.
> The backend auto-detects OTA availability on startup and switches mode automatically.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Login to ALM server |
| GET | `/api/auth/domains` | Get accessible domains |
| GET | `/api/auth/projects` | Get projects for domain |
| POST | `/api/auth/connect` | Connect to project |
| POST | `/api/auth/logout` | Disconnect & logout |
| POST | `/api/user/provision` | Grant user access |
| GET | `/api/user/groups` | List project groups |
| POST | `/api/extract/tests` | Extract test cases |
| POST | `/api/extract/defects` | Extract defects |
| POST | `/api/generate/evidence` | Generate evidence docs |
| POST | `/api/update/test-type` | Bulk update test types |
| POST | `/api/download/attachments` | Download attachments |
| POST | `/api/maintenance/notify` | Send maintenance email |
| GET | `/api/dashboard/stats` | Dashboard statistics |
| GET | `/api/health` | Service health check |

---

## 📁 Project Structure

```
One_Stop_ALM_Administration/
├── backend/
│   ├── app.py              # Flask REST API (all 8 utilities + single ALM thread)
│   └── requirements.txt    # Python dependencies
├── src/
│   ├── pages/              # React page components
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── TestExtraction.tsx
│   │   ├── DefectExtraction.tsx
│   │   ├── EvidenceGenerator.tsx
│   │   ├── TestTypeUpdate.tsx
│   │   ├── AttachmentDownloader.tsx
│   │   ├── AccessProvider.tsx
│   │   └── MaintenanceNotification.tsx
│   ├── services/
│   │   └── api.ts          # API service layer with timeout + offline fallback
│   ├── hooks/
│   │   └── useExecutionConsole.ts  # Execution console + demo simulation
│   ├── components/
│   │   ├── AppLayout.tsx
│   │   ├── ModuleLayout.tsx
│   │   └── ExecutionConsole.tsx
│   └── contexts/
│       └── AuthContext.tsx  # Session validation + auto-clear stale tokens
├── start.bat               # Windows launcher — installs deps + starts backend
├── package.json
├── vite.config.ts
└── README.md
```

---

## 🔐 Authentication Flow

```
1. Enter ALM Server URL + Username + Password
2. Backend calls tdc.InitConnectionEx() + tdc.Login()
3. Domains loaded from tdc.VisibleDomains
4. Select Domain → Projects loaded from tdc.VisibleProjects()
5. Click Connect → tdc.Connect(domain, project)
6. Session token passed to all 8 utilities
7. Sign Out → tdc.Disconnect() + tdc.Logout() + tdc.ReleaseConnection()
```

---

## 👨‍💻 Author

**Pongowtham Kumar S**
RPA Developer | Automation & ALM Integration Engineer

- 4+ years experience at Infosys
- 20+ production bots deployed
- ALM v16 → v24 upgrade specialist
- 4 GitHub automation repositories

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077b5?style=flat&logo=linkedin)](https://linkedin.com/in/pongowthamkumar)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-333?style=flat&logo=github)](https://github.com/pongowthamkumar4209-svg)

---

## 📄 License

This project is for portfolio and demonstration purposes.

---

<div align="center">
  <strong>⭐ Star this repo if you found it useful!</strong>
</div>
