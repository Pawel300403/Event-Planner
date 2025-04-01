import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = JSON.stringify(import.meta.env.VITE_SUPABASE_URL);
// const supabaseKey = JSON.stringify(import.meta.env.VITE_SUPABASE_ANON_KEY);

// Pierwsza wersja bazy
const supabaseUrl = 'https://sjudppqltzpgwpveehzf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqdWRwcHFsdHpwZ3dwdmVlaHpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI0MzcxMDksImV4cCI6MjAzODAxMzEwOX0.TucMTG0DQtJJyZb-2omg8Y8im9D7jXCRy9lkSlXiCLk';
const adminKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqdWRwcHFsdHpwZ3dwdmVlaHpmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMjQzNzEwOSwiZXhwIjoyMDM4MDEzMTA5fQ.-xx-sXz_OQlC75KyIz2nDPZq9Nm1jntMWAeY4XJlGwU'

// Druga wersja bazy
// const supabaseUrl = 'https://kdsertqyfvmlkavnxypm.supabase.co'
// const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtkc2VydHF5ZnZtbGthdm54eXBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5MzQ2MDMsImV4cCI6MjA1MjUxMDYwM30.YNLrKn5lTymwMGE1jHl6f5nHzrIgc25q_ZsCoG3RDe4'
// const adminKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtkc2VydHF5ZnZtbGthdm54eXBtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNjkzNDYwMywiZXhwIjoyMDUyNTEwNjAzfQ.YKdDF8U4B4TUkYLz0V6g6TzVQ6GynI3-A13HsQ1Bgsc'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const supabaseAdmin = createClient(supabaseUrl, adminKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
}).auth.admin