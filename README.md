# ☀️ Smart Solar Energy Recommendation Assistant
> **AI-Powered Solar Energy Sizing, Financial Advisory & Subsidy Intelligence Platform for India**  
> An engineering-grade full-stack web application recommending optimal rooftop solar PV systems for Indian homes, institutions, commercial facilities, and industrial plants.

---

## 🌟 Overview & Key Features

**Smart Solar Energy Recommendation Assistant** is a production-grade web application built to accelerate India's transition to clean energy. It combines **deterministic renewable energy physics modeling** with **Google Gemini generative AI** to deliver transparent, subsidy-eligible, and technically compliant solar solutions.

### 🚀 Highlights & Features
1. **Home Page**:
   - Modern hero section with solar illustrations, key national benchmarks (300+ sunny days in India, PM Surya Ghar subsidy bracket up to ₹78,000, 25-year panel lifecycle).
   - "How It Works" 4-step workflow and an interactive State Solar Insolation Explorer.
2. **Solar Recommendation Engine**:
   - Validated site input form (City, State, Property Type, Monthly Bill ₹, Monthly Consumption kWh, Roof Area sq ft, Budget, Roof Type, Connection Type, Battery Needs).
   - Generates exact system capacity (kW), panel count (540W Mono PERC Bifacial), gross cost, central financial assistance (PM Surya Ghar CFA subsidy), net investment, monthly & annual generation, annual bill savings, and simple payback in years.
   - Generates an AI technical and financial audit rationale.
   - Saves all audit reports automatically into an **SQLite database**.
3. **Solar Cost Calculator**:
   - Interactive live sliders for Capacity (kW), Grid Tariffs (₹4 to ₹16/kWh), Installation Capex (₹/kW), Peak Sun Hours (PSH), Degradation Rate (0.7%/yr), and Tariff Escalation (3.5%/yr).
   - Recharts area curve rendering a **25-year cumulative net cash flow** with break-even threshold.
4. **SolarAI Floating Chatbot**:
   - Always-accessible floating assistant trained on Indian solar policies, net metering, panel technology (Mono PERC vs TOPCon), battery chemistries (LiFePO4 vs Lead-Acid), and maintenance routines.
   - Connects to Google Gemini API with smart offline fallback knowledge base.
5. **System Sizing & Comparison**:
   - Side-by-side capacity comparison for **1 kW, 3 kW, 5 kW, and 10 kW** systems.
   - Architecture comparison for **On-Grid (Grid-Tied)** vs **Hybrid (Battery Backup)** vs **Off-Grid (Standalone)**.
6. **Executive Dashboard**:
   - Analytics KPI cards, Monthly Electricity Bill Comparison chart (Before vs After Solar), 25-Year Cumulative Savings Trajectory, and SQLite-backed recommendation history with detail modals.
7. **Contact & Consultation**:
   - Form with input validation (Email, 10-digit Indian mobile number) and real persistence to SQLite (`contacts` table) with ticket tracking reference (`SOLAR-XXXX`).

---

## 🛠️ Technology Stack

| Component | Technology | Description |
|---|---|---|
| **Frontend** | React 18 + Vite | Modern reactive frontend with fast HMR |
| **Styling** | Tailwind CSS | Custom emerald-green palette, glassmorphism, responsive UI |
| **Icons** | Lucide React | High-clarity vector UI iconography |
| **Charts** | Recharts | Interactive SVG area, bar, and line charts |
| **Backend** | Python FastAPI | Asynchronous high-performance REST API |
| **Database** | SQLite3 | Embedded zero-config relational storage |
| **AI Integration** | Google Gemini API | `gemini-1.5-flash` / `gemini-2.0-flash` with domain fallback engine |
| **HTTP Client** | HTTPX | Asynchronous HTTP client for Gemini API communication |

---

## 💻 Setup Instructions

### 🍎 For macOS / MacBook (Terminal / zsh)

Open the **Terminal** app on your Mac and run the following:

```bash
# 1. Navigate to the project directory:
cd /Users/yeshwanth/.gemini/antigravity/scratch/solar-assistant

# 2. Setup the Python FastAPI Backend:
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env

# Optional: Add your Gemini API key in .env (or leave blank for Demo Mode):
# nano .env   (paste GEMINI_API_KEY=your_key_here, then press Ctrl+O, Enter, Ctrl+X)

# 3. Start the Backend Server:
uvicorn main:app --reload --host 127.0.0.1 --port 8000

# 4. In a NEW separate Terminal tab/window (press Cmd + T), setup and run the React Frontend:
cd /Users/yeshwanth/.gemini/antigravity/scratch/solar-assistant/frontend
npm install
npm run dev

# 5. Open your web browser (Safari / Chrome) and access:
# http://localhost:5173
```

---

## 🪟 Step-by-Step Windows Setup Instructions

Follow these step-by-step instructions to run the complete project on any **Windows 10 / 11** PC.

### Step 1: Prerequisites
Ensure you have the following installed on Windows:
1. **Python 3.10 or higher**: [Download from python.org](https://www.python.org/downloads/)
   > ⚠️ *Important:* When installing Python on Windows, make sure to check the box: **"Add python.exe to PATH"**.
2. **Node.js (LTS version 18 or higher)**: [Download from nodejs.org](https://nodejs.org/)
3. **Git (Optional but recommended)**: [Download from git-scm.com](https://git-scm.com/)

---

### Step 2: Open PowerShell or Command Prompt
Press `Win + X` and select **Terminal** or **PowerShell**, or press `Win + R`, type `cmd`, and press Enter.

Navigate to your workspace directory:
```powershell
cd C:\Users\YourUsername\Projects\solar-assistant
```

---

### Step 3: Backend Setup (Python FastAPI & SQLite)

1. Navigate to the `backend` folder:
   ```powershell
   cd backend
   ```

2. Create a Python virtual environment:
   ```powershell
   python -m venv venv
   ```

3. Activate the virtual environment:
   * **In PowerShell:**
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
     *(If you get a script execution policy error in PowerShell, run this once: `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` and try again).*
   * **In Command Prompt (cmd.exe):**
     ```cmd
     venv\Scripts\activate.bat
     ```

4. Install the backend Python dependencies:
   ```powershell
   pip install -r requirements.txt
   ```

5. Configure Environment Variables:
   Copy `.env.example` to `.env`:
   * **In PowerShell:**
     ```powershell
     Copy-Item .env.example .env
     ```
   * **In Command Prompt:**
     ```cmd
     copy .env.example .env
     ```

   Open `.env` in Notepad or VS Code:
   ```powershell
   notepad .env
   ```
   *To enable live Gemini AI generation, paste your free Google Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey):*
   ```env
   GEMINI_API_KEY=AIzaSyYourActualKeyHere...
   HOST=127.0.0.1
   PORT=8000
   ```
   *(Note: If left blank, the application automatically runs in **Interactive Demo Mode**, utilizing its built-in rule engine and knowledge base!)*

6. Start the FastAPI backend server:
   ```powershell
   uvicorn main:app --reload --host 127.0.0.1 --port 8000
   ```
   *The backend will start at `http://127.0.0.1:8000` and automatically initialize the SQLite database (`solar.db`).*

---

### Step 4: Frontend Setup (React.js with Vite)

Open a **new separate terminal window** in the project root:

1. Navigate to the `frontend` folder:
   ```powershell
   cd frontend
   ```

2. Install npm dependencies:
   ```powershell
   npm install
   ```

3. Start the Vite development server:
   ```powershell
   npm run dev
   ```

4. Open your web browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 🧪 Testing the Application

1. **Test Solar Recommendation**:
   - Go to `http://localhost:5173/#recommendation`
   - Select State: **Rajasthan** or **Karnataka**, Property: **Residential**, Bill: **₹3,500**, Roof: **400 sq ft**.
   - Click **Generate Recommended Solar Plan**.
   - Verify that:
     * Recommended capacity is sized to ~3.5 kW.
     * PM Surya Ghar subsidy is accurately computed at **₹78,000**.
     * Payback period is ~2.7 years.
     * Record is saved to SQLite DB (check Dashboard).
2. **Test Solar Cost Calculator**:
   - Go to `http://localhost:5173/#calculator`
   - Move the Capacity slider and Tariff slider; observe instant 60fps recalculations of the 25-year cumulative wealth curve.
3. **Test SolarAI Floating Chatbot**:
   - Click the floating **SolarAI Assistant** button in the bottom right corner.
   - Ask: *"What is the PM Surya Ghar subsidy for a 3kW system?"* or *"What is the difference between On-grid and Hybrid?"*
4. **Test Contact Submission**:
   - Go to `http://localhost:5173/#contact`
   - Submit a test inquiry; observe the assigned ticket number (e.g. `SOLAR-0001`) and view it in the submitted inquiries log.

---

## 📡 API Endpoint Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Backend status, SQLite connection, and Gemini configuration status |
| `GET` | `/api/states` | List of 23 Indian states with solar irradiance (PSH) benchmarks |
| `POST` | `/api/recommend` | Runs deterministic sizing + AI rationale; saves record in SQLite |
| `GET` | `/api/recommendations` | Retrieves recommendation history from SQLite |
| `DELETE` | `/api/recommendations/{id}` | Deletes a stored recommendation record |
| `POST` | `/api/calculate` | Interactive calculator for customized financial & degradation curves |
| `POST` | `/api/chat` | SolarAI chatbot assistant powered by Gemini API / knowledge base |
| `POST` | `/api/contact` | Validates inquiry and stores into SQLite contacts table |
| `GET` | `/api/contacts` | Retrieves submitted inquiry logs |

---

## 🏛️ Production & Deployment Ready
Architected for rapid deployment to **Render**, **Vercel**, or **AWS/GCP** with full SQLite persistence, robust error boundaries, and adaptive mobile responsive layouts.
