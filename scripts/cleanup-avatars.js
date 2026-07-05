const { createClient } = require("@supabase/supabase-js");



const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanup() {
  const { data, error } = await supabase.storage.from("avatars").list();
  if (error) {
    console.error("Error listing files:", error);
    return;
  }
  
  if (!data || data.length <= 1) {
    console.log("Nothing to clean up.");
    return;
  }
  
  // Sort files by created_at descending (newest first)
  const sorted = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  
  // Keep the first (newest), collect the rest for deletion
  const filesToDelete = sorted.slice(1).map(f => f.name);
  
  console.log("Deleting old files:", filesToDelete);
  
  const { error: deleteError } = await supabase.storage.from("avatars").remove(filesToDelete);
  
  if (deleteError) {
    console.error("Error deleting files:", deleteError);
  } else {
    console.log("Cleanup complete!");
  }
}

cleanup();
