/**
 * BuildWise AI — Municipal Regulation Evidence
 * Checklist: 068
 *
 * Evidence storage only. This module never turns an unverified source into a
 * regulatory conclusion. Interpretation must remain explicitly attributed.
 */

export const EVIDENCE_STATUS = Object.freeze({
  VERIFIED: "verified",
  UNVERIFIED: "unverified",
  EXPIRED: "expired",
  CONFLICTING: "conflicting"
});

export function createRegulationEvidence(input = {}) {
  const sourceUrl = String(input.sourceUrl || "").trim();
  if (!sourceUrl) throw new Error("sourceUrl is required");

  return Object.freeze({
    id: input.id || cryptoRandomId(),
    jurisdiction: String(input.jurisdiction || "").trim(),
    subject: String(input.subject || "").trim(),
    sourceUrl,
    sourceTitle: String(input.sourceTitle || "").trim(),
    authority: String(input.authority || "").trim(),
    issuedAt: input.issuedAt || null,
    effectiveFrom: input.effectiveFrom || null,
    effectiveTo: input.effectiveTo || null,
    retrievedAt: input.retrievedAt || new Date().toISOString(),
    excerpt: String(input.excerpt || "").trim(),
    documentHash: input.documentHash || null,
    status: input.status || EVIDENCE_STATUS.UNVERIFIED,
    interpretation: input.interpretation || null,
    interpretationStatus: input.interpretationStatus || "not_verified"
  });
}

export function isUsableEvidence(evidence = {}, now = new Date()) {
  if (!evidence.sourceUrl || !evidence.authority) return false;
  if (evidence.status !== EVIDENCE_STATUS.VERIFIED) return false;
  if (evidence.effectiveFrom && new Date(evidence.effectiveFrom) > now) return false;
  if (evidence.effectiveTo && new Date(evidence.effectiveTo) < now) return false;
  return true;
}

export function buildEvidenceSet(items = [], now = new Date()) {
  const evidence = items.map(createRegulationEvidence);
  return {
    evidence,
    usable: evidence.filter(item => isUsableEvidence(item, now)),
    conflicts: evidence.filter(item => item.status === EVIDENCE_STATUS.CONFLICTING)
  };
}

export function regulationDecisionInput(evidenceSet = {}) {
  const usable = Array.isArray(evidenceSet.usable) ? evidenceSet.usable : [];
  return {
    evidenceIds: usable.map(x => x.id),
    sourceCount: usable.length,
    hasVerifiedEvidence: usable.length > 0,
    interpretationAllowed: usable.every(x => x.interpretationStatus === "verified"),
    warning: usable.length ? null : "No verified municipal evidence available"
  };
}

function cryptoRandomId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return "reg-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
}
