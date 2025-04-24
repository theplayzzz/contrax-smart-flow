
import { createClient } from '@supabase/supabase-js';

// Supabase client configuration
const supabaseUrl = 'https://wzhegwhhsxwdfxwwjjur.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6aGVnd2hoc3h3ZGZ4d3dqanVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MzQzNjQsImV4cCI6MjA2MTExMDM2NH0.9Usj2LxNMmbpATCJ7LyKaqQw1aceo4L7jbuwDkDJPSo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
