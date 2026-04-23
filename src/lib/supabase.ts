import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mehhjrcssziznafrcxle.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1laGhqcmNzc3ppem5hZnJjeGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0NzU5NTcsImV4cCI6MjA3NTA1MTk1N30.hjaXtLGwOUtB6DkEk8Bw7nq4awSvtEjfbg7U-V735oY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
