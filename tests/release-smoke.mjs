import fs from "node:fs";

const required = [
  "index.html",
  "buildwise-app.js",
  "src/domains/crm/data-import.js",
  "mobile-foundation.css",
  "buildwise-ui.css",
  "manifest.webmanifest",
  "sw.js",
  "netlify.toml",
  "supabase/migrations/20260919_release_hardening.sql"
];

for (const file of required) {
  if (!fs.existsSync(file)) throw new Error("Missing required release file: " + file);
}

const index = fs.readFileSync("index.html", "utf8");
for (const ref of ["./buildwise-app.js", "./src/domains/crm/data-import.js"]) {
  if (!index.includes(ref)) throw new Error("index.html does not load " + ref);
}

const app = fs.readFileSync("buildwise-app.js", "utf8");
for (const marker of ["supabase.createClient", "/functions/v1/public-request", "/functions/v1/ai-orchestrator"]) {
  if (!app.includes(marker)) throw new Error("BuildWise runtime marker missing: " + marker);
}

console.log("Release smoke checks passed.");

// Backup workflow guardrails: catch accidental plaintext artifact uploads and
// ensure the encrypted-backup workflow fails closed when required configuration
// or output files are missing. These are static contract checks, not a restore drill.
const backupWorkflowPath = ".github/workflows/database-backup.yml";
if (!fs.existsSync(backupWorkflowPath)) {
  throw new Error("Missing encrypted database backup workflow: " + backupWorkflowPath);
}
const backupWorkflow = fs.readFileSync(backupWorkflowPath, "utf8");
for (const marker of [
  "SUPABASE_DB_URL",
  "BACKUP_AGE_RECIPIENT",
  "age -r \"$BACKUP_AGE_RECIPIENT\" -o backup/roles.sql.age backup/roles.sql",
  "age -r \"$BACKUP_AGE_RECIPIENT\" -o backup/schema.sql.age backup/schema.sql",
  "age -r \"$BACKUP_AGE_RECIPIENT\" -o backup/data.sql.age backup/data.sql",
  "rm -f backup/roles.sql backup/schema.sql backup/data.sql",
  "sha256sum --check SHA256SUMS",
  "path: backup/",
  "if-no-files-found: error",
  "retention-days: 30"
]) {
  if (!backupWorkflow.includes(marker)) {
    throw new Error("Backup workflow safety contract missing: " + marker);
  }
}
const encryptionIndex = backupWorkflow.indexOf("Encrypt every database dump before artifact upload");
const uploadIndex = backupWorkflow.indexOf("Upload encrypted backup artifact");
const plaintextRemovalIndex = backupWorkflow.indexOf("rm -f backup/roles.sql backup/schema.sql backup/data.sql");
if (encryptionIndex < 0 || uploadIndex < 0 || encryptionIndex >= uploadIndex || plaintextRemovalIndex < encryptionIndex || plaintextRemovalIndex >= uploadIndex) {
  throw new Error("Backup workflow must encrypt and remove plaintext dumps before artifact upload.");
}
