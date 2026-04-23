export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { recipeId, token } = req.body || {};

    if (!recipeId) {
      return res.status(400).json({ error: "recipeId is required" });
    }

    if (!token || token !== process.env.ADMIN_DELETE_TOKEN) {
      return res.status(401).json({ error: "Invalid admin token" });
    }

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

    if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
      return res.status(500).json({ error: "Missing server environment variables" });
    }

    const { createClient } = await import("@supabase/supabase-js");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    await supabase.from("saved_recipes").delete().eq("recipe_id", recipeId);
    await supabase.from("reviews").delete().eq("recipe_id", recipeId);
    await supabase.from("recipe_ingredients").delete().eq("recipe_id", recipeId);
    await supabase.from("recipe_steps").delete().eq("recipe_id", recipeId);

    const { error } = await supabase.from("recipes").delete().eq("id", recipeId);

    if (error) {
      return res.status(500).json({ error: error.message || "Delete failed" });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message || "Unexpected error" });
  }
}
