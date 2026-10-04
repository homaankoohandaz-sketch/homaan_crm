import assert from "node:assert/strict";
import test from "node:test";
import {
  normalizePlanFacts,
  detectPlanDocumentType,
  extractFactsFromText,
  comparePlanToPermit,
  detectMissingPlanInformation,
  PLAN_INTELLIGENCE_SOURCES
} from "../../src/domains/plan-intelligence/plan-intelligence.js";

test("301-312: plan intelligence contract", () => {
  assert.equal(detectPlanDocumentType({name:"plan.pdf",type:"application/pdf"}), "pdf");
  assert.equal(detectPlanDocumentType({name:"plan.dxf",type:""}), "dxf");
  const facts = extractFactsFromText("Gross Area 1,200 Useful Area 950 Units 8 Parking 10 Storage 8 Floors 5 Land 400");
  assert.equal(facts.gross_area, 1200);
  assert.equal(facts.useful_area, 950);
  assert.equal(facts.unit_count, 8);
  assert.equal(facts.parking_count, 10);
  assert.equal(facts.storage_count, 8);
  assert.equal(facts.floor_count, 5);
  assert.equal(facts.land_area, 400);
  assert.deepEqual(comparePlanToPermit(facts, {...facts, unit_count:7}).mismatches[0], {
    field:"unit_count", plan:8, permit:7, delta:1
  });
  assert.deepEqual(detectMissingPlanInformation(normalizePlanFacts({gross_area:100, useful_area:80, unit_count:4, parking_count:4, floor_count:2, land_area:200})), ["storage_count"]);
  assert.equal(PLAN_INTELLIGENCE_SOURCES.pdf, "Mozilla PDF.js");
});
