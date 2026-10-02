# BuildWise — Task C/D — Plan Intelligence + Visualization Research/Integration

Status: IMPLEMENTED / ACCEPTANCE PARTIAL
Canonical checklist: 301–312 and 682–688

## Objective
Use mature open-source components where technically and legally suitable, behind BuildWise-owned adapters. Do not create a parallel engine.

## Selected components
- Tesseract.js — browser OCR — Apache-2.0
- Mozilla PDF.js — PDF extraction — Apache-2.0
- dxf-parser — DXF parsing — MIT
- Three.js — 3D/360 rendering — MIT
- Floor Plan Document Intelligence — MIT reference for raster plan segmentation/OCR
- Floorplan2Walkthru — research reference only; not vendored

## Deliberate exclusions
- No GPL/AGPL CAD parser is embedded.
- DWG remains an ingestion boundary requiring a conversion/worker path.
- AIFloorPlan is not embedded because its AGPL-3.0/commercial licensing is not compatible with the current proprietary application strategy.

## BuildWise implementation
- src/domains/plan-intelligence/plan-intelligence.js
- src/domains/project-visualization/project-visualization.js
- src/ui/plan-visualization-adapter.js
- tests/unit/plan-intelligence-301-312.test.mjs
- tests/unit/project-visualization-682-688.test.mjs
- tests/unit/plan-visualization-adapter.test.mjs
- docs/architecture/PLAN-VISUALIZATION-TOOLS.md
- THIRD-PARTY-NOTICES.md

## Acceptance gate
These checklist items remain PARTIAL until actual browser/runtime ingestion of representative PDF/image/DXF files and visualization are verified. Implementation or unit tests alone do not make them DONE.
