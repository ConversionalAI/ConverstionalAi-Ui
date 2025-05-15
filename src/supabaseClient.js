import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase credentials
const SUPABASE_URL = 'https://piuvwnqwenlausbfmute.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpdXZ3bnF3ZW5sYXVzYmZtdXRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MjMzNDAsImV4cCI6MjA1OTA5OTM0MH0.ArSQxH7hWKjqxZn0DQI7ae4M4H40Mquq3o2FFadT6FQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
