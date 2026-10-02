/**
 * BuildWise AI — Plan Intelligence adapter layer
 * Checklist: 301–312
 *
 * This module is the application-owned orchestration layer.
 * Third-party engines stay replaceable behind these adapters.
 */

const SOURCES = Object.freeze({
  ocr: "Tesseract.js",
  pdf: "Mozilla PDF.js",
  dxf: "dxf-parser",
  floorplanReference: "Floor Plan Document Intelligence / CubiCasa5K-compatible research"
});

export function normalizePlanFacts(input = {}) {
  const n = value => {
    if (value === null || value === undefined || value === "") return null;
    const x = Number(String(value).replace(/,/g, "").trim());
    return Number.isFinite(x) ? x : null;
  };
  return {
    gross_area: n(input.gross_area),
    useful_area: n(input.useful_area),
    unit_count: n(input.unit_count),
    parking_count: n(input.parking_count),
    storage_count: n(input.storage_count),
    floor_count: n(input.floor_count),
    land_area: n(input.land_area),
    setbacks: input.setbacks ?? null,
    source: input.source ?? null,
    confidence: input.confidence ?? null
  };
}

export function detectPlanDocumentType(file = {}) {
  const name = String(file.name || "").toLowerCase();
  const type = String(file.type || "").toLowerCase();
  if (type.includes("pdf") || name.endsWith(".pdf")) return "pdf";
  if (name.endsWith(".dxf") || type.includes("dxf")) return "dxf";
  if (name.endsWith(".dwg") || type.includes("dwg")) return "dwg";
  if (type.startsWith("image/") || /\.(png|jpe?g|webp|bmp|tiff?)$/.test(name)) return "image";
  return "document";
}

export async function extractPdfText(file) {
  const pdfjs = await import("https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.149/build/pdf.mjs");
  const data = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data }).promise;
  const pages = [];
  for (let pageNo = 1; pageNo <= pdf.numPages; pageNo += 1) {
    const page = await pdf.getPage(pageNo);
    const content = await page.getTextContent();
    pages.push({
      page: pageNo,
      text: content.items.map(item => item.str || "").join(" ").trim()
    });
  }
  return { pages, text: pages.map(p => p.text).join("\n"), pageCount: pdf.numPages, source: SOURCES.pdf };
}

export async function runOcr(image, { language = "eng" } = {}) {
  const { createWorker } = await import("https://cdn.jsdelivr.net/npm/tesseract.js@6.0.1/+esm");
  const worker = await createWorker(language);
  try {
    const result = await worker.recognize(image);
    return {
      text: result.data.text || "",
      confidence: Number(result.data.confidence || 0),
      source: SOURCES.ocr
    };
  } finally {
    await worker.terminate();
  }
}

export async function parseDxf(file) {
  const { default: DxfParser } = await import("https://cdn.jsdelivr.net/npm/dxf-parser@1.1.2/+esm");
  const text = await file.text();
  const parser = new DxfParser();
  const parsed = parser.parseSync ? parser.parseSync(text) : parser.parse(text);
  return {
    type: "dxf",
    layers: parsed.tables?.layer?.layers || parsed.tables?.layers || {},
    entities: parsed.entities || [],
    header: parsed.header || {},
    source: SOURCES.dxf
  };
}

export function extractFactsFromText(text = "") {
  const clean = String(text);
  const find = patterns => {
    for (const pattern of patterns) {
      const match = clean.match(pattern);
      if (match) return Number(String(match[1]).replace(/,/g, ""));
    }
    return null;
  };
  return normalizePlanFacts({
    gross_area: find([/(?:gross|built|زیربنا|مساحت\s*کل)[^\d]{0,30}([\d,]+(?:\.\d+)?)/i]),
    useful_area: find([/(?:useful|net|مفید|خالص)[^\d]{0,30}([\d,]+(?:\.\d+)?)/i]),
    unit_count: find([/(?:units?|واحد)[^\d]{0,20}(\d+)/i]),
    parking_count: find([/(?:parking|پارکینگ)[^\d]{0,20}(\d+)/i]),
    storage_count: find([/(?:storage|انباری)[^\d]{0,20}(\d+)/i]),
    floor_count: find([/(?:floors?|طبقات?)[^\d]{0,20}(\d+)/i]),
    land_area: find([/(?:land|plot|زمین)[^\d]{0,30}([\d,]+(?:\.\d+)?)/i]),
    source: "text-extraction"
  });
}

export function comparePlanToPermit(plan = {}, permit = {}) {
  const p = normalizePlanFacts(plan);
  const q = normalizePlanFacts(permit);
  const fields = ["gross_area","useful_area","unit_count","parking_count","storage_count","floor_count","land_area"];
  const mismatches = [];
  for (const field of fields) {
    if (p[field] == null || q[field] == null) continue;
    if (p[field] !== q[field]) mismatches.push({
      field,
      plan: p[field],
      permit: q[field],
      delta: p[field] - q[field]
    });
  }
  return { matches: mismatches.length === 0, mismatches };
}

export function detectMissingPlanInformation(facts = {}) {
  const required = ["gross_area","useful_area","unit_count","parking_count","floor_count","land_area"];
  return required.filter(key => facts[key] === null || facts[key] === undefined || facts[key] === "");
}

export const PLAN_INTELLIGENCE_SOURCES = SOURCES;
