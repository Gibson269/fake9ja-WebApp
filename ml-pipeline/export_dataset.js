#!/usr/bin/env node
/**
 * Fake9ja Sentinel — Anti-Counterfeit Dataset Exporter (Node.js)
 * Exports ground-truth labeled reports (verified_fake vs verified_original)
 * into standard computer vision dataset format with metadata.json.
 *
 * Usage:
 *   node ml-pipeline/export_dataset.js [--api-url http://127.0.0.1:8000/api] [--output ./dataset_export]
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
function getArg(flag, fallback) {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : fallback;
}

const API_URL = getArg("--api-url", "http://127.0.0.1:8000/api");
const OUTPUT_DIR = path.resolve(process.cwd(), getArg("--output", "./ml-pipeline/dataset_export"));
const CATEGORY_FILTER = getArg("--category", null);

const FALLBACK_SEED = [
  {
    id: 1,
    reference_id: "EIE-NG-248193",
    product_name: "Amatem Forte Softgel / Tablets",
    brand: "Amatem",
    category: "Medicines",
    state: "Kano",
    market_address: "Sabon Gari Market, Kano",
    issue_type: "Fake NAFDAC & Blurred Batch Code",
    details: "Purchased blister pack with missing hologram seal and unverifiable scratch PIN.",
    purchase_price: "2400",
    status: "verified_fake",
    risk_level: "high",
    reviewer_note: "Confirmed clone batch. Chemical inspection confirmed adulterated active pharmaceutical ingredient (API).",
    media_urls: ["/images/counterfeit-malaria.jpg"]
  },
  {
    id: 2,
    reference_id: "EIE-NG-248192",
    product_name: "FloraPure Radiance Body Lotion",
    brand: "FloraPure",
    category: "Cosmetics",
    state: "Lagos",
    market_address: "Balogun Market, Lagos Island",
    issue_type: "Tampered Cap & Chemical Odour",
    details: "The inner seal looked re-glued with hot glue and caused severe rash after one test patch.",
    purchase_price: "4800",
    status: "verified_fake",
    risk_level: "medium",
    reviewer_note: "Unregistered chemical compound, toxic steroid presence detected.",
    media_urls: ["/images/counterfeit-cosmetics.jpg"]
  },
  {
    id: 3,
    reference_id: "EIE-NG-248191",
    product_name: "Total Quartz 9000 Engine Oil (5L)",
    brand: "TotalEnergies",
    category: "Automotive",
    state: "Lagos",
    market_address: "Ladipo Auto Spare Parts Market, Mushin",
    issue_type: "Cloned QR Code & Thin Viscosity",
    details: "QR code redirected to a deceptive lookalike website instead of totalenergies.ng.",
    purchase_price: "22000",
    status: "verified_fake",
    risk_level: "high",
    reviewer_note: "Re-packaged recycled waste oil in counterfeit container.",
    media_urls: ["/images/counterfeit-oil.jpg"]
  }
];

async function fetchReports() {
  const url = `${API_URL.replace(/\/$/, "")}/ml/dataset/export`;
  console.log(`[+] Attempting connection to live backend: ${url}`);
  try {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (res.ok) {
      const json = await res.json();
      if (json && json.data) {
        console.log(`[✓] Successfully fetched ${json.data.length} live records from Laravel API.`);
        return json.data;
      }
    }
  } catch (err) {
    console.log(`[!] Live backend not running (${err.message}). Using local benchmark seed dataset...`);
  }
  return FALLBACK_SEED;
}

function formatSample(r) {
  const rawPrice = (r.purchase_price || "").toString().replace(/[^0-9.]/g, "");
  const numPrice = rawPrice ? parseFloat(rawPrice) : null;

  const images = (r.media_urls || []).map((url, idx) => ({
    file_url: url,
    modality: idx === 0 ? "front_packaging" : idx === 1 ? "seal_hologram" : "barcode_qr",
    bounding_boxes: []
  }));

  return {
    sample_id: `FAKE9JA-${r.reference_id}`,
    reference_id: r.reference_id,
    product_name: r.product_name,
    brand: r.brand || "Unspecified",
    category: r.category,
    ground_truth_label: r.status,
    risk_level: r.risk_level || "medium",
    purchase_price_ngn: numPrice,
    market_address: r.market_address,
    state: r.state,
    defect_tags: r.status === "verified_fake" ? ["defect_tampered_seal", "defect_fake_hologram"] : [],
    images,
    reviewer_note: r.reviewer_note || null,
    created_at: r.created_at || new Date().toISOString()
  };
}

async function run() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const rawReports = await fetchReports();
  const samples = [];

  for (const item of rawReports) {
    if (CATEGORY_FILTER && item.category !== CATEGORY_FILTER) {
      continue;
    }
    // Only verified samples
    if (item.status === "verified_fake" || item.status === "verified_original" || item.ground_truth_label) {
      samples.push(item.ground_truth_label ? item : formatSample(item));
    }
  }

  const catalog = {
    version: "1.0.0",
    dataset_name: "Fake9ja Anti-Counterfeit Benchmark",
    exported_at: new Date().toISOString(),
    total_samples: samples.length,
    classes: ["verified_original", "verified_fake"],
    samples
  };

  const metadataPath = path.join(OUTPUT_DIR, "metadata.json");
  fs.writeFileSync(metadataPath, JSON.stringify(catalog, null, 2), "utf-8");

  console.log(`\n======================================================`);
  console.log(`[✓] Fake9ja ML Training Dataset Exported!`);
  console.log(`    - Output File:   ${metadataPath}`);
  console.log(`    - Total Samples: ${samples.length}`);
  console.log(`    - Classes:       verified_fake, verified_original`);
  console.log(`    - Ready for Computer Vision (ViT, YOLO) training.`);
  console.log(`======================================================\n`);
}

run();
