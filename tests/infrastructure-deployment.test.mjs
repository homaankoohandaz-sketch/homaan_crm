import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const required = [
  ".github/workflows/cloudflare-pages.yml",
  ".github/workflows/supabase-migration-check.yml",
  ".github/workflows/deployment-health.yml",
  "wrangler.toml",
  "docs/INFRASTRUCTURE-DEPLOYMENT.md",
  "docs/ENVIRONMENT-SEPARATION.md",
  "docs/ROLLBACK-BACKUP.md",
  ".assetsignore",
];

test("infrastructure deployment contract files exist", () => {
  for (const file of required) {
    assert.equal(fs.existsSync(file), true, file + " is missing");
  }
});

test("production deployment workflow is main-only and uses Cloudflare Pages", () => {
  const workflow = fs.readFileSync(".github/workflows/cloudflare-pages.yml", "utf8");
  assert.match(workflow, /branches:\s*\[main\]/);
  assert.match(workflow, /cloudflare\/wrangler-action@v4/);
  assert.match(workflow, /--branch=main/);
  assert.match(workflow, /CLOUDFLARE_API_TOKEN/);
  assert.match(workflow, /CLOUDFLARE_ACCOUNT_ID/);
});

test("deployment health check is fail-closed on a missing URL", () => {
  const workflow = fs.readFileSync(".github/workflows/deployment-health.yml", "utf8");
  assert.match(workflow, /PRODUCTION_URL/);
  assert.match(workflow, /curl/);
  assert.match(workflow, /--fail/);
});

test("migration workflow never applies production migrations automatically", () => {
  const workflow = fs.readFileSync(".github/workflows/supabase-migration-check.yml", "utf8");
  assert.match(workflow, /pull_request/);
  assert.match(workflow, /supabase db push --dry-run/);
  assert.doesNotMatch(workflow, /supabase db push(?! --dry-run)/);
});


test("public Pages assets exclude repository control-plane and test material", () => {
  const ignore = fs.readFileSync(".assetsignore", "utf8");
  for (const entry of [".github/", ".agent-control/", ".codex/", "tests/", "docs/", "supabase/", "node_modules/"]) {
    assert.ok(ignore.includes(entry), entry + " is not excluded");
  }
});
