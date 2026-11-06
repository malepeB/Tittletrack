import { supabase } from './supabase';
export async function logAudit(action, detail) { await supabase.from('audit_log').insert({ action, detail }); }
