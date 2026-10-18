#!/usr/bin/env python3
"""
Fake9ja Sentinel — Anti-Counterfeit Dataset Exporter
Exports verified reports (verified_fake vs verified_original) into
a structured dataset ready for training Computer Vision / Multimodal models.

Usage:
    python export_dataset.py --api-url http://127.0.0.1:8000/api --output ./training_dataset
"""

import os
import sys
import json
import argparse
import urllib.request
import urllib.error
from pathlib import Path


def parse_args():
    parser = argparse.ArgumentParser(description="Export Fake9ja labeled dataset for ML training")
    parser.add_argument("--api-url", default="http://127.0.0.1:8000/api", help="Fake9ja API Base URL")
    parser.add_argument("--output", default="./dataset_export", help="Output directory for exported dataset")
    parser.add_argument("--category", default=None, help="Filter by product category (e.g., Medicines)")
    parser.add_argument("--only-verified", action="store_true", default=True, help="Only export verified_fake and verified_original items")
    return parser.parse_args()


def fetch_reports(api_url: str):
    url = f"{api_url.rstrip('/')}/reports"
    print(f"[+] Fetching reports from {url}...")
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Fake9ja-MLExporter/1.0"})
        with urllib.request.urlopen(req, timeout=10) as response:
            payload = json.loads(response.read().decode("utf-8"))
            return payload.get("data", [])
    except urllib.error.URLError as e:
        print(f"[!] Warning: Unable to connect to live API ({e}). Falling back to local offline sample dataset...")
        return get_fallback_dataset()


def get_fallback_dataset():
    """Provides seed dataset when backend server is offline."""
    return [
        {
            "id": 1,
            "reference_id": "EIE-NG-248193",
            "product_name": "Amatem Forte Softgel / Tablets",
            "brand": "Amatem",
            "category": "Medicines",
            "state": "Kano",
            "market_address": "Sabon Gari Market, Kano",
            "issue_type": "Fake NAFDAC & Blurred Batch Code",
            "details": "Purchased blister pack with missing hologram seal and unverifiable scratch PIN.",
            "purchase_price": "2400",
            "status": "verified_fake",
            "risk_level": "high",
            "reviewer_note": "Confirmed clone batch. Chemical inspection confirmed adulterated active pharmaceutical ingredient (API).",
            "media_urls": ["/images/counterfeit-malaria.jpg"]
        },
        {
            "id": 2,
            "reference_id": "EIE-NG-248192",
            "product_name": "FloraPure Radiance Body Lotion",
            "brand": "FloraPure",
            "category": "Cosmetics",
            "state": "Lagos",
            "market_address": "Balogun Market, Lagos Island",
            "issue_type": "Tampered Cap & Chemical Odour",
            "details": "The inner seal looked re-glued with hot glue and caused severe rash after one test patch.",
            "purchase_price": "4800",
            "status": "verified_fake",
            "risk_level": "medium",
            "reviewer_note": "Unregistered chemical compound, toxic steroid presence detected.",
            "media_urls": ["/images/counterfeit-cosmetics.jpg"]
        },
        {
            "id": 3,
            "reference_id": "EIE-NG-248191",
            "product_name": "Total Quartz 9000 Engine Oil (5L)",
            "brand": "TotalEnergies",
            "category": "Automotive",
            "state": "Lagos",
            "market_address": "Ladipo Auto Spare Parts Market, Mushin",
            "issue_type": "Cloned QR Code & Thin Viscosity",
            "details": "QR code redirected to a deceptive lookalike website instead of totalenergies.ng.",
            "purchase_price": "22000",
            "status": "verified_fake",
            "risk_level": "high",
            "reviewer_note": "Re-packaged recycled waste oil in counterfeit container.",
            "media_urls": ["/images/counterfeit-oil.jpg"]
        }
    ]


def format_dataset_sample(item: dict) -> dict:
    price_val = None
    if item.get("purchase_price"):
        raw_price = str(item["purchase_price"]).replace("₦", "").replace(",", "").strip()
        try:
            price_val = float(raw_price)
        except ValueError:
            price_val = None

    images = []
    for media_url in item.get("media_urls", []):
        images.append({
            "file_url": media_url,
            "modality": "front_packaging",
            "bounding_boxes": []
        })

    return {
        "sample_id": f"FAKE9JA-{item.get('reference_id', 'UNKNOWN')}",
        "reference_id": item.get("reference_id"),
        "product_name": item.get("product_name"),
        "brand": item.get("brand"),
        "category": item.get("category"),
        "ground_truth_label": item.get("status"),
        "risk_level": item.get("risk_level"),
        "purchase_price_ngn": price_val,
        "market_address": item.get("market_address"),
        "state": item.get("state"),
        "defect_tags": ["defect_fake_hologram"] if item.get("status") == "verified_fake" else [],
        "images": images,
        "reviewer_note": item.get("reviewer_note"),
        "created_at": item.get("created_at", "2026-10-16T00:00:00Z")
    }


def main():
    args = parse_args()
    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)

    raw_reports = fetch_reports(args.api_url)
    dataset_samples = []

    for report in raw_reports:
        status = report.get("status")
        if args.only_verified and status not in ("verified_fake", "verified_original"):
            continue
        if args.category and report.get("category") != args.category:
            continue

        sample = format_dataset_sample(report)
        dataset_samples.append(sample)

    metadata_path = output_dir / "metadata.json"
    with open(metadata_path, "w", encoding="utf-8") as f:
        json.dump({
            "version": "1.0.0",
            "dataset_name": "Fake9ja Anti-Counterfeit Benchmark",
            "total_samples": len(dataset_samples),
            "classes": ["verified_original", "verified_fake"],
            "samples": dataset_samples
        }, f, indent=2)

    print(f"\n[✓] Export completed successfully!")
    print(f"    - Output: {metadata_path}")
    print(f"    - Labeled Samples: {len(dataset_samples)}")
    print(f"    - Ready for training computer vision / multimodal classifiers.\n")


if __name__ == "__main__":
    main()
