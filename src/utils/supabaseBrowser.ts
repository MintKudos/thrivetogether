import { createClient } from "@supabase/supabase-js"
import { supabaseUrl, supabaseAnonKey } from "./config"
console.log('supabaseUrl', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
