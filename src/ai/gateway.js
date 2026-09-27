import { getRuntimeConfig } from '../core/runtime/config.js';
import { validateAction } from './contracts/action-contract.js';

export function createAIGateway({ fetchImpl = globalThis.fetch, getSession } = {}) {
  if (typeof fetchImpl !== 'function') throw new TypeError('fetch implementation is required');

  return Object.freeze({
    async chat(message, context = {}) {
      if (!String(message ?? '').trim()) throw new TypeError('message is required');
      return request({ type: 'chat', message: String(message), context });
    },

    async execute(action, options = {}) {
      const validation = validateAction(action);
      if (!validation.valid) {
        const error = new Error('Invalid AI action');
        error.code = 'INVALID_AI_ACTION';
        error.details = validation.errors;
        throw error;
      }
      return request({ type: 'action', action }, options);
    }
  });

  async function request(body, options = {}) {
    const config = getRuntimeConfig(globalThis);
    const session = typeof getSession === 'function' ? await getSession() : null;
    const token = session?.access_token || session?.accessToken;

    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    const response = await fetchImpl(config.functionsBaseUrl + '/ai-orchestrator', {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: options.signal
    });

    let payload = null;
    try { payload = await response.json(); } catch {}

    if (!response.ok) {
      const error = new Error(payload?.error || `AI gateway request failed (${response.status})`);
      error.status = response.status;
      error.payload = payload;
      throw error;
    }

    return payload;
  }
}
