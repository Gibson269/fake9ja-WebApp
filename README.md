# Fake9ja Sentinel 🛡️
> **Citizen-Powered Counterfeit Intelligence Network & Anti-Counterfeit AI Training Pipeline**

[![React](https://img.shields.io/badge/Frontend-React_19_+_Vite-61DAFB?logo=react&logoColor=black)](./frontend)
[![Laravel](https://img.shields.io/badge/Backend-Laravel_12_REST_API-FF2D20?logo=laravel&logoColor=white)](./backend)
[![Dataset Pipeline](https://img.shields.io/badge/ML_Pipeline-Dataset_Curation-0052CC?logo=python&logoColor=white)](./ml-pipeline)
[![Architecture](https://img.shields.io/badge/Architecture-Decoupled_Monorepo-000000)](./SOURCE_OF_TRUTH.md)

---

## 🎯 Strategic Mission

Fake9ja Sentinel is engineered to solve the counterfeit crisis in Nigerian commerce (medicines, cosmetics, foods, motor oils, and electronics). 

It functions as:
1. **A Free Public Incident & Verification Network:** Allowing shoppers and pharmacists to report counterfeit items, inspect hotspot markets, and track case resolution.
2. **An AI Model Data Gathering Engine:** Systematically capturing, validating, and annotating multi-perspective product imagery (packaging, hologram seals, barcodes, and laser batch codes) to build and fine-tune machine learning models that aid consumers in identifying genuine vs fake products.

---

## 📂 Repository Structure

```
fake9ja/
├── SOURCE_OF_TRUTH.md     # 📖 Canonical Source of Truth (Architecture, Schemas, ML specs)
├── GUIDE.md               # 🚀 Simple Developer & Contributor Guide
├── README.md              # 📌 Project Overview (this document)
├── AGENTS.md              # 🤖 Agent & Contributor Engineering Guidelines
├── package.json           # 🎛️ Root monorepo orchestrator
├── netlify.toml           # 🌐 Edge deployment configuration
│
├── frontend/              # 💻 React 19 Client SPA
│   ├── src/               # Components, routes, resilient API client
│   ├── public/            # Static image assets & fallbacks
│   ├── vite.config.ts     # Vite bundler & backend proxy config
│   └── package.json       # React dependencies
│
├── backend/               # ⚙️ Laravel 12 Headless REST API
│   ├── app/               # Controllers, Models (Report, Hotspot, BrandWatch)
│   ├── database/          # Migrations & Nigerian market seeders
│   ├── routes/api.php     # REST endpoints & /api/ml/dataset/export
│   └── artisan            # Laravel CLI runner
│
└── ml-pipeline/           # 🧠 ML Model Dataset Pipeline
    ├── DATASET_GUIDELINES.md # 5-Point photo capture & labeling taxonomy SOP
    ├── dataset_schema.json   # JSON schema specification for dataset exports
    └── export_dataset.py     # Python exporter for CV/ViT training
```

---

## ⚡ Quickstart

### 1. Run the Frontend (Instant, zero database required)
```bash
npm run dev:frontend
```
Open [http://localhost:5173](http://localhost:5173). The frontend includes resilient local fallbacks, realistic seed data, and a browser-based storage engine for immediate testing.

### 2. Run the Full Stack (Laravel API + Frontend)
```bash
# Terminal 1: Laravel API
cd backend
php artisan serve

# Terminal 2: React Frontend
npm run dev:frontend
```

### 3. Export Data for Machine Learning
```bash
python ml-pipeline/export_dataset.py --api-url http://127.0.0.1:8000/api --output ./training_dataset
```

---

## 🔑 Default Admin Credentials
- **Desk URL:** [http://localhost:5173/admin](http://localhost:5173/admin)
- **Email:** `admin@fake9ja.ng`
- **Password:** `admin123`

---

## 📚 Essential Reading
- **[Single Source of Truth (SOURCE_OF_TRUTH.md)](./SOURCE_OF_TRUTH.md):** Complete specifications, API contracts, and the 5-point image modality breakdown.
- **[Developer Guide (GUIDE.md)](./GUIDE.md):** How the citizen-to-model data flow works.
- **[Dataset Guidelines (ml-pipeline/DATASET_GUIDELINES.md)](./ml-pipeline/DATASET_GUIDELINES.md):** Standard operating procedures for photo capture and defect tagging.

---

## ⚖️ License
Licensed under the [MIT License](LICENSE).
