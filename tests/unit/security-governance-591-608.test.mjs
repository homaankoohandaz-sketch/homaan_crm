import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const migration = fs.readFileSync(
  "supabase/migrations/20261002133000_security_governance_591_608.sql",
  "utf8"
);

test("591-608 security migration covers the observed advisor findings", () => {
  for (const table of [
    "deal_timeline_events","deal_actions","deal_followups","deal_risks",
    "deal_participation_calculations","deal_payment_schedules",
    "project_kpi_definitions","project_kpi_thresholds",
    "workflow_definitions","workflow_steps","workflow_templates",
    "workflow_runs","workflow_run_events","workflow_assignments",
    "workflow_notifications","workflow_approvals"
  ]) assert.match(migration, new RegExp(table));

  for (const view of [
    "project_kpi_live","project_kpi_catalog","project_kpi_trends","project_kpi_drilldown",
    "project_kpi_alerts","workflow_history","workflow_audit","deal_workspace_control",
    "project_unit_sales_matrix","project_material_current_value","project_material_daily_prices",
    "project_cost_intelligence","project_land_comparables","project_unit_cost_allocation",
    "project_profitability_sensitivity","project_return_allocation","project_sales_inventory",
    "project_offer_current_versions","project_sales_profitability","project_document_register",
    "project_document_plan_data","project_kpi_dashboard"
  ]) assert.match(migration, new RegExp("[\'\"]"+view+"[\'\"]"));
  assert.ok(migration.includes("execute format('alter view public.%I set (security_invoker = true)', v)"));

  assert.match(migration, /revoke execute on function public\.route_new_public_request\(\) from anon, authenticated/);
  assert.match(migration, /revoke execute on function public\.route_public_request\(uuid\) from anon, authenticated/);
  assert.match(migration, /revoke execute on function public\.manager_edit_record\(text,text,jsonb,text\) from anon/);
  assert.match(migration, /revoke execute on function public\.reos_sync_property_graph\(integer\) from anon/);
  assert.match(migration, /build_project_unit_sale_price/);
  assert.match(migration, /refresh_project_kpi_snapshot/);
  assert.match(migration, /workflow_start/);
});
