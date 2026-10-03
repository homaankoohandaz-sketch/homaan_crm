import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";

test("browser adapter is wired as a lazy bridge", () => {
  const source = fs.readFileSync("src/ui/plan-visualization-adapter.js", "utf8");
  assert.match(source, /plan-intelligence\/plan-intelligence\.js/);
  assert.match(source, /project-visualization\/project-visualization\.js/);
  assert.match(source, /BuildWisePlanTools/);
});
