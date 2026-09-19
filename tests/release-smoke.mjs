import fs from "node:fs";

const required = [
  "index.html","buildwise-app.js","data-import.js","mobile-foundation.css",
  "buildwise-ui.css","manifest.webmanifest","sw.js","netlify.toml",
  "supabase/migrations/20260919_release_hardening.sql"
];
for (const file of required) {
  if (!fs.existsSync(file)) throw new Error("Missing required release file: " + file);
}
const index = fs.readFileSync("index.html", "utf8");
for (const ref of ["./buildwise-app.js", "./data-import.js"]) {
  if (!index.includes(ref)) throw new Error("index.html does not load " + ref);
}
const app = fs.readFileSync("buildwise-app.js", "utf8");
for (const marker of ["supabase.createClient", "/functions/v1/public-request", "/functions/v1/ai-orchestrator"]) {
  if (!app.includes(marker)) throw new Error("BuildWise runtime marker missing: " + marker);
}
console.log("Release smoke checks passed.");
