// Data-quality facade for CRM imports.
// Canonical logic lives in import-quality.js; this module keeps the stable
// public names used by tests/crm-realestate-batch.test.js.
import '../../core/data-normalization.js';
import { editImportedRecord, rollbackPlan, buildDataQualityDashboard as baseDashboard, expandContactPairRows } from './import-quality.js';
import { findSamePhoneCandidates } from './operations.js';

export { editImportedRecord, expandContactPairRows };

// Canonical dashboard + duplicate-phone groups (merge is never automatic).
export function buildDataQualityDashboard(rows = [], options = {}) {
  return { ...baseDashboard(rows, options), duplicatePhoneGroups: findSamePhoneCandidates(rows).length };
}
// A rollback *plan* is a dry run: building it changes nothing. Executing it is
// destructive and still requires a manager (see import-quality.rollbackPlan).
export function createRollbackPlan(input) {
  return { ...rollbackPlan(input), destructive: false, dryRun: true, executionDestructive: true };
}
