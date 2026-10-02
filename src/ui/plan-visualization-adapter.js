/**
 * Browser bridge for BuildWise plan intelligence + visualization.
 * Keeps buildwise-app.js classic-script compatible while loading ES modules lazily.
 */
(async function(){
  try {
    const [plan, visual] = await Promise.all([
      import("../domains/plan-intelligence/plan-intelligence.js"),
      import("../domains/project-visualization/project-visualization.js")
    ]);
    window.BuildWisePlanTools = Object.freeze({
      ...plan,
      ...visual
    });
  } catch (error) {
    console.error("BuildWise plan/visualization adapter failed", error);
    window.BuildWisePlanTools = { error };
  }
})();
