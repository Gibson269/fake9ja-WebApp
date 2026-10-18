# Fake9ja Anti-Counterfeit Model — Dataset Guidelines & Labeling Standard Operating Procedure (SOP)

This document outlines the standard operating procedures for gathering, validating, and annotating product imagery and metadata to train machine learning models for detecting counterfeit goods.

---

## 1. Why Data Quality is Critical
Counterfeits in Nigeria have evolved from crude knockoffs to sophisticated clones featuring:
- Replicated holograms with slight refractive angle discrepancies.
- Cloned or copied genuine NAFDAC registration numbers.
- Double-lasered expiry dates over expired batches.
- Subtly diluted chemical compounds in cosmetics and pharmaceuticals.

To train an AI model capable of assisting consumers in the field, our training dataset requires **high visual fidelity**, **paired genuine vs. fake examples**, and **structured ground-truth labels**.

---

## 2. Five Essential Photo Perspectives
When gathering photos (either via field agents, citizen uploads, or lab inspections), aim for these 5 distinct viewpoints:

```
[ Perspective 1: Front Packaging ]
  ├── Full container or box face
  └── Evaluates: Overall color palette, logo proportion, brand typographic kerning.

[ Perspective 2: Tamper-Evident Seal / Hologram ]
  ├── 45-degree angled macro photo with light reflection
  └── Evaluates: 3D depth, micro-text ("GENUINE"), holographic shimmer, tear strip.

[ Perspective 3: Barcode & QR Code ]
  ├── Flat, glare-free capture of 1D/2D code
  └── Evaluates: Bar line clarity, check digit validity, QR payload destination.

[ Perspective 4: Batch Number & Expiry Stamp ]
  ├── High-contrast close-up of inkjet or laser stamping
  └── Evaluates: Dot-matrix vs inkjet font, double printing, date sequence logic.

[ Perspective 5: Regulatory Panel & Manufacturer Details ]
  ├── Back or side panel text showing NAFDAC / SON / ISO stamps
  └── Evaluates: Regulatory number format, spelling mistakes in ingredients.
```

---

## 3. Labeling Taxonomy & Classes

When reviewing a case in the Admin Desk, assign one of the following ground-truth classifications:

### 3.1 Primary Status Classes
- `verified_original`: Confirmed authentic via manufacturer confirmation, authorized distributor chain of custody, or chemical assay.
- `verified_fake`: Confirmed counterfeit with at least one verifiable failure point (e.g., cloned batch code, incorrect packaging dimensions, laboratory assay failure).
- `under_review`: Candidate data point awaiting verification from brand protection partners.
- `inconclusive`: Media quality too low or conflicting indicators; excluded from training set.

### 3.2 Defect Annotation Tags (For YOLO / Segmentation Models)
When a report is confirmed counterfeit, tag all specific defects observed:
- `defect_tampered_seal`: Cap seal broken, re-glued, or missing.
- `defect_fake_hologram`: Flat sticker imitating 3D hologram or lacking diffraction.
- `defect_altered_expiry`: Re-stamped date, scratched off date, or impossible expiry range.
- `defect_spelling_error`: Typos in brand name, manufacturer address, or ingredients.
- `defect_blurred_barcode`: Barcode with broken lines or unreadable scanner checksum.
- `defect_color_deviation`: Packaging pigment faded, washed out, or incorrect hue.
- `defect_price_anomaly`: Retail purchase price $>60\%$ below authentic market benchmark.

---

## 4. Dataset Directory Structure for ML Training

When the dataset is exported via `ml-pipeline/export_dataset.py`, the output follows this computer vision standard:

```
dataset_export/
├── metadata.json              # Full catalog mapping every image to labels & metrics
├── train/
│   ├── images/                # Normalized 1024x1024 images
│   └── labels/                # YOLO / Pascal VOC format annotations
├── val/
│   ├── images/
│   └── labels/
└── test/
    ├── images/
    └── labels/
```

---

## 5. Privacy & Legal Compliance
1. **Redaction of Citizen PII:** Citizen phone numbers, personal faces, and private payment details must be stripped before images are exported to the public or training corpus.
2. **Vendor Location Integrity:** Market names and city locations (e.g., "Balogun Market, Lagos") are preserved as critical feature embeddings for hotspot risk scoring.
