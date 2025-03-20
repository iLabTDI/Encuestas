// src/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://knmosnzasrojogialduw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtubW9zbnphc3Jvam9naWFsZHV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1MDA2OTQsImV4cCI6MjA1ODA3NjY5NH0.7mKbVv1kEJvTOBYjewg0P1hccsHQ1KCoDSvnFf5kZC0'; // Reemplaza con tu anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
