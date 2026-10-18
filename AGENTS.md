# Fake9ja Sentinel Project — Agent Instructions

Citizen-powered counterfeit reporting and safety verification network.

## Canonical Reference Files
- **Primary Source of Truth:** Consult [`SOURCE_OF_TRUTH.md`](./SOURCE_OF_TRUTH.md) for authoritative system architecture, data models, and the 5-point image modality specifications.
- **Operational Guide:** Consult [`GUIDE.md`](./GUIDE.md) for how to run frontend/backend and how the citizen-to-model data workflow operates.
- **ML Training Pipeline:** Consult [`ml-pipeline/DATASET_GUIDELINES.md`](./ml-pipeline/DATASET_GUIDELINES.md) and [`ml-pipeline/dataset_schema.json`](./ml-pipeline/dataset_schema.json) for dataset export rules.

## Core Architecture
- **`frontend/`**: React 19 + TanStack Router + Tailwind CSS 4 SPA. Never introduce PHP dependencies here.
- **`backend/`**: Laravel 12 Headless REST API. Never bundle Node/Vite build artifacts here.
- **`ml-pipeline/`**: Python export utilities and JSON schemas for training counterfeit detection models.
- **Root**: Monorepo orchestrator via `package.json` workspaces.

## Engineering Guidelines
- Maintain strict module decoupling between `frontend/` and `backend/`.
- Maintain resilient local fallbacks: the frontend must continue functioning smoothly even if the PHP backend is offline.
- Do not compress uploaded evidence imagery below $1200\times1200$ px; resolution is vital for training computer vision models.
- Ensure all admin status updates (`verified_fake`, `verified_original`) contain informative reviewer notes describing failure points.
