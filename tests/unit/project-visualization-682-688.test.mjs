import assert from "node:assert/strict";
import test from "node:test";
import {
  VISUALIZATION_CAPABILITIES,
  createElevationSvg,
  createFloorPlanSvg,
  buildScenarioSet,
  build4DFrame
} from "../../src/domains/project-visualization/project-visualization.js";

test("682-688: visualization contracts", () => {
  assert.equal(VISUALIZATION_CAPABILITIES.elevation2d, "682");
  assert.equal(VISUALIZATION_CAPABILITIES.project4d, "688");
  assert.match(createElevationSvg({width:20,floors:4}), /<svg/);
  assert.match(createFloorPlanSvg({rooms:[{x:0,y:0,width:5,height:4,name:"Living"}]}), /Living/);
  assert.equal(buildScenarioSet({id:"base"}, [{id:"alt"}]).length, 2);
  const frame = build4DFrame([{id:"foundation",startProgress:0,endProgress:25}], 12.5)[0];
  assert.equal(frame.visible, true);
  assert.equal(frame.completion, 0.5);
});
