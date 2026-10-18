# Fake9ja Sentinel — Developer & Operational Guide
*A Simple, Actionable Guide to Running the Platform and Gathering Data for Counterfeit Detection AI*

---

## 1. The Core Purpose Made Simple

Think of Fake9ja Sentinel as a **two-way bridge**:
1. **To the Consumer:** It's a free, lightning-fast web tool where citizens can snap photos of suspected counterfeit medicines, cosmetics, drinks, and motor oils, check market hotspots, and report fraud.
2. **To the AI / ML Team:** It is a **continuous data collection and labeling engine**. Every verified report generates high-quality labeled photographs (front packaging, tamper seal, barcode, batch stamp) that train our computer vision model to detect fake products automatically.

---

## 2. Project Layout at a Glance

The project is cleanly divided into three distinct modules:

```
fake9ja/
├── frontend/        → The React 19 Client (UI, citizen wizard, camera intake, admin desk)
├── backend/         → The Laravel 12 API (Database, incident storage, verification endpoints)
├── ml-pipeline/     → Data export scripts, JSON schemas, and ML training guidelines
├── SOURCE_OF_TRUTH.md → Deep architectural reference and specifications
├── GUIDE.md         → This operational guide
└── package.json     → Root runner to launch or build the entire project
```

---

## 3. Quickstart: Running the System in 2 Minutes

### Scenario A: Running the Frontend Only (Instant, Zero Dependencies)
If you just want to run the web interface without installing PHP or a database:
```bash
# From the root directory:
npm run dev:frontend

# Or navigate directly:
cd frontend
npm run dev
```
Open [http://localhost:5173](http://localhost:5173).  
The frontend is built with an **intelligent local fallback**: it automatically loads realistic Nigerian incident reports and saves new reports directly into your browser's storage if the backend isn't running. You can test the full user journey immediately!

---

### Scenario B: Running the Full Stack (Frontend + Laravel Backend)
When you have PHP installed and want full database persistence:

1. **Start the Backend API:**
   ```bash
   cd backend
   php artisan serve
   ```
   *Runs on `http://127.0.0.1:8000`.*

2. **In a second terminal, start the Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
   *Runs on `http://localhost:5173` with built-in proxy forwarding to the backend.*

---

## 4. The Citizen-to-Model Workflow: Step-by-Step

Here is how data moves from a street market into our machine learning training set:

```
Step 1: Citizen Buys Suspected Product
  ↓
Step 2: Submits Report via /report
  • Citizen selects category (e.g., Medicines, Cosmetics)
  • Uploads photos (Front pack, hologram/seal, barcode, expiry date)
  • Enters location (e.g., Balogun Market, Lagos) & purchase price
  • Gets an instant tracking reference (e.g., EIE-NG-248193)
  ↓
Step 3: Incident Appears in Admin Triage (/admin)
  • Review team logs in with: admin@fake9ja.ng / admin123
  • Inspects uploaded imagery side-by-side
  • Verifies against manufacturer specifications
  ↓
Step 4: Labeling Ground Truth
  • If fake: Mark status as "verified_fake", add failure points (e.g. "Cloned batch code, missing hologram")
  • If authentic: Mark status as "verified_original"
  ↓
Step 5: Exporting into ML Dataset
  • Run python ml-pipeline/export_dataset.py
  • Generates dataset_export/metadata.json with normalized images and labels
  • Models (YOLO / Vision Transformers) are trained and updated!
```

---

## 5. Admin Desk Credentials

To test the verification and labeling interface:
- **URL:** [http://localhost:5173/admin](http://localhost:5173/admin)
- **Email:** `admin@fake9ja.ng`
- **Password:** `admin123`

Inside the Admin Desk, you can:
- Change report statuses between `received`, `under_review`, `verified_fake`, `verified_original`, and `escalated`.
- Add official reviewer notes describing exact visual defects.
- Manage market hotspots and public awareness video testimonies.

---

## 6. How to Export Data for AI Model Training

When you are ready to export labeled data for training:
```bash
# Navigate to the ml-pipeline folder:
cd ml-pipeline

# Run the exporter:
python export_dataset.py --api-url http://127.0.0.1:8000/api --output ./training_dataset
```
This generates:
- `training_dataset/metadata.json`: Machine-readable catalog adhering to `dataset_schema.json`.
- Paired samples labeled with `verified_fake` or `verified_original` along with defect tags.

---

## 7. Developer Rules of Thumb

1. **Keep it Simple & Resilient:**
   Always ensure any new frontend feature fails gracefully if the backend server is temporarily unreachable.
2. **Prioritize Image Clarity:**
   When adding camera features or upload fields, never compress or crop away barcodes, holographic badges, or batch numbers. High resolution is essential for machine learning.
3. **Labels are Ground Truth:**
   Only mark a record as `verified_fake` or `verified_original` if there is clear evidence. Inconclusive items should remain in `under_review`.
4. **Questions or Inquiries:**
   Consult [`SOURCE_OF_TRUTH.md`](./SOURCE_OF_TRUTH.md) for full architectural specs, schemas, and security standards.
