import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const isConfigured = Boolean(url && anonKey);

export const supabase = isConfigured
  ? createClient(url as string, anonKey as string)
  : null;

export const supabaseReady = isConfigured;
