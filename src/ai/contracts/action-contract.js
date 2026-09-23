export const ACTION_TYPES = Object.freeze([
  'create_lead','create_task','create_request','match_property','analyze_property',
  'analyze_feasibility','analyze_finance','draft_document','update_project','flag_risk'
]);
export function validateAction(action = {}) {
  if (!ACTION_TYPES.includes(action.type)) return { valid:false, errors:['unsupported_action_type'] };
  if (!action.payload || typeof action.payload !== 'object') return { valid:false, errors:['payload_required'] };
  return { valid:true, errors:[] };
}
