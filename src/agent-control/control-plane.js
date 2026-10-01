import { createWorkerRegistry, routeTask } from './worker-registry.js';

const required = ['task_id','objective','requester','specialist','runtime','priority','scope_in','scope_out','inputs','expected_outputs','source_of_truth','dependencies','allowed_tools','files_or_records_allowed','approval_gates','acceptance_tests','deadline','handoff_path'];

export function createAgentControlPlane({ registry = createWorkerRegistry(), execute = null } = {}) {
  return Object.freeze({
    registry,

    validateTaskContract(task = {}) {
      const missing = required.filter(k => task[k] === undefined || task[k] === null);
      return { valid: missing.length === 0, missing };
    },

    route(task = {}) {
      const contract = this.validateTaskContract(task);
      if (!contract.valid) return { status: 'invalid_contract', ...contract };
      return routeTask(task, registry);
    },

    authorize(task = {}, actor = {}) {
      const route = this.route(task);
      if (route.status !== 'ready') return { authorized: false, reason: route.status };
      const allowed = Array.isArray(task.allowed_tools) ? task.allowed_tools : [];
      const requested = Array.isArray(actor.tools) ? actor.tools : [];
      const toolsOk = allowed.every(tool => requested.includes(tool));
      return { authorized: toolsOk, worker: route.worker, reason: toolsOk ? 'authorized' : 'tool_scope_mismatch' };
    },

    validateResult(result = {}, task = {}) {
      const expected = Array.isArray(task.expected_outputs) ? task.expected_outputs : [];
      const missing = expected.filter(k => result[k] === undefined);
      return { valid: missing.length === 0, missing };
    },

    handoff(task = {}, result = {}, status = 'READY_FOR_APPROVAL') {
      return {
        status,
        task_id: task.task_id ?? null,
        objective: task.objective ?? null,
        model_used: result.model_used ?? null,
        base_sha: result.base_sha ?? null,
        claim_scope: result.claim_scope ?? task.files_or_records_allowed ?? [],
        evidence: result.evidence ?? [],
        inputs: task.inputs ?? [],
        outputs: result.outputs ?? [],
        actions_taken: result.actions_taken ?? [],
        tests: result.tests ?? [],
        risks: result.risks ?? [],
        blockers: result.blockers ?? [],
        escalation_files: result.escalation_files ?? [],
        next_action: result.next_action ?? null,
        approval_required: result.approval_required ?? false,
        iterations_used: result.iterations_used ?? 0
      };
    },

    recover(task = {}, failure = {}) {
      return {
        task_id: task.task_id ?? null,
        status: 'RECOVERY_REQUIRED',
        reason: failure.reason ?? 'worker_failure',
        retryable: failure.retryable !== false,
        preserve_state: true,
        next_action: failure.next_action ?? 'requeue_with_same_contract'
      };
    },

    async dispatch(task = {}, actor = {}) {
      const auth = this.authorize(task, actor);
      if (!auth.authorized) return { status: 'blocked', reason: auth.reason, worker: auth.worker ?? null };
      if (typeof execute !== 'function') return { status: 'ready', worker: auth.worker, approval_required: true };
      try {
        const result = await execute(task, auth.worker);
        const validation = this.validateResult(result, task);
        if (!validation.valid) return { status: 'invalid_result', worker: auth.worker, ...validation };
        return { status: 'completed', worker: auth.worker, result };
      } catch (error) {
        return { status: 'recovery_required', worker: auth.worker, recovery: this.recover(task, { reason: error.message }) };
      }
    }
  });
}
