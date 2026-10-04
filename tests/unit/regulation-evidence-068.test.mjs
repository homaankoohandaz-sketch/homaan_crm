import assert from "node:assert/strict";
import test from "node:test";
import {
  createRegulationEvidence,
  isUsableEvidence,
  buildEvidenceSet,
  regulationDecisionInput,
  EVIDENCE_STATUS
} from "../../src/domains/regulation/regulation-evidence.js";

test("068: regulation evidence never treats unverified material as verified", () => {
  const item = createRegulationEvidence({
    jurisdiction: "Shiraz",
    subject: "setback",
    sourceUrl: "https://example.invalid/regulation.pdf",
    authority: "Municipality",
    status: EVIDENCE_STATUS.UNVERIFIED
  });
  assert.equal(isUsableEvidence(item), false);

  const verified = createRegulationEvidence({
    ...item,
    id: "verified-1",
    status: EVIDENCE_STATUS.VERIFIED,
    interpretationStatus: "verified"
  });
  const set = buildEvidenceSet([item, verified]);
  assert.equal(set.usable.length, 1);
  assert.equal(regulationDecisionInput(set).hasVerifiedEvidence, true);
  assert.equal(regulationDecisionInput(set).interpretationAllowed, true);
});

test("068: expired evidence is excluded", () => {
  const item = createRegulationEvidence({
    sourceUrl: "https://example.invalid/regulation.pdf",
    authority: "Municipality",
    status: EVIDENCE_STATUS.VERIFIED,
    effectiveTo: "2020-01-01T00:00:00Z"
  });
  assert.equal(isUsableEvidence(item, new Date("2026-10-03T00:00:00Z")), false);
});
