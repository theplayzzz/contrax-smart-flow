
import { createClient } from '@supabase/supabase-js';

// Supabase client configuration
const supabaseUrl = 'https://wzhegwhhsxwdfxwwjjur.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6aGVnd2hoc3h3ZGZ4d3dqanVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MzQzNjQsImV4cCI6MjA2MTExMDM2NH0.9Usj2LxNMmbpATCJ7LyKaqQw1aceo4L7jbuwDkDJPSo';

// Create the Supabase client with debugging
console.log("Initializing Supabase client with URL:", supabaseUrl);
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'public',
  },
  global: {
    fetch: (url, options) => {
      console.log("Supabase fetch request:", url);
      return fetch(url, options);
    },
  },
});

console.log("Supabase client initialized");

// Test the connection
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error("Error connecting to Supabase:", error);
  } else {
    console.log("Supabase connection successful:", data.session ? "User is logged in" : "No active session");
    console.log("Supabase auth:", data);
  }
});

// Teste simples de inserção para verificar a conexão com o banco
const testTableConnection = async () => {
  try {
    console.log("Testing database connection by checking schema...");
    const { data, error } = await supabase
      .from('contracts')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error("Error testing contracts table:", error);
    } else {
      console.log("Successfully connected to contracts table:", data);
    }
  } catch (err) {
    console.error("Exception in testing table connection:", err);
  }
};

testTableConnection();
