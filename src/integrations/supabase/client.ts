// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pgizkgmflfdlshoacerw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaXprZ21mbGZkbHNob2FjZXJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzNzMzMzcsImV4cCI6MjA1NTk0OTMzN30.2spClOJuVqlDBManx137YynMqH6dOS9I5H0uunjd4xY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);