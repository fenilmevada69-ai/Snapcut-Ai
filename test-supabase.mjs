import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  "https://fsurmiobtjamcqazhcep.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzdXJtaW9idGphbWNxYXpoY2VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MDU5MzcsImV4cCI6MjA5MzI4MTkzN30.xCICpkih8htnUKtvx0jYJLqHHUaB4xY36gVuEbpEsUw"
);

async function test() {
  const { data, error } = await supabase.from('profiles').select('*').limit(1);
  console.log("Profiles check:");
  console.log("Data:", data);
  console.log("Error:", error);
}

test();
