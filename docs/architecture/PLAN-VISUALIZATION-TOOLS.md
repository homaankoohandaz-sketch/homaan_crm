# BuildWise AI — Plan Intelligence & Visualization Tool Decision

## Scope
- Checklist 301–312: OCR / PDF / CAD / architectural-plan intelligence.
- Checklist 682–688: 2D elevation/floor-plan, scenarios, 3D, 360°, multi-angle and 4D visualization.

## Decision
BuildWise uses a thin application-owned adapter layer instead of copying an entire external application or creating a parallel engine.

### Plan intelligence
1. Tesseract.js for browser OCR. Apache-2.0.
2. Mozilla PDF.js for PDF text extraction. Apache-2.0.
3. dxf-parser for DXF parsing. MIT.
4. Floor Plan Document Intelligence is retained as a reference implementation for raster floor-plan segmentation/OCR. Its repository is MIT, but its Python runtime is kept out of the browser path until a bounded worker/runtime is available.
5. DWG is intentionally not treated as a browser-native parser in this first implementation. The ingestion contract accepts DWG and routes it to a conversion/worker boundary; no GPL/AGPL CAD library is embedded.

### Visualization
1. Three.js for 3D scene rendering and 360° texture/view support. MIT.
2. BuildWise-owned SVG generators provide deterministic 2D elevation/floor-plan output.
3. BuildWise-owned scenario and 4D contracts map project schedule/progress to visualization state.
4. Floorplan2Walkthru is a research reference, not copied wholesale: it is a PoC with known single-story limitations. Its ideas inform the browser pipeline, while BuildWise keeps its own domain contracts.

## Reuse rule
- Reuse mature components where licensing and architecture fit.
- Do not create duplicate engines.
- Keep external libraries behind replaceable adapters.
- Preserve attribution/license notices.

## Acceptance
Implementation is PARTIAL until CI + runtime/UI verification of actual file ingestion and visualization is complete.
