export class Worker {
  constructor({ name, capabilities = [] } = {}) {
    if (!name) throw new Error("worker name is required");
    this.name = name;
    this.capabilities = [...capabilities];
  }

  async execute(task) {
    throw new Error("Worker.execute must be implemented by an adapter");
  }
}

export function createWorkerResult({ worker, task, status, output = null, error = null, evidence = [] }) {
  return {
    task_id: task.id,
    worker,
    status,
    output,
    error,
    evidence,
    completed_at: new Date().toISOString()
  };
}
