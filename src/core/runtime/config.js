const DEFAULT_SUPABASE_URL = 'https://beuestoewletjsgmigmf.supabase.co';

export function getRuntimeConfig(source = globalThis) {
  const env = source?.process?.env ?? {};
  const meta = source?.__BUILDWISE_CONFIG__ ?? {};
  const url = meta.SUPABASE_URL ?? env.SUPABASE_URL ?? DEFAULT_SUPABASE_URL;
  const anonKey = meta.SUPABASE_ANON_KEY ?? env.SUPABASE_ANON_KEY ?? '';

  if (!url) throw new Error('SUPABASE_URL is required');

  return Object.freeze({
    supabaseUrl: String(url).replace(/\/$/, ''),
    supabaseAnonKey: String(anonKey),
    functionsBaseUrl: String(url).replace(/\/$/, '') + '/functions/v1'
  });
}
