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
      return res.status(401).json({ error: "관리자 비밀번호가 올바르지 않습니다." });
    }

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

    if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
      return res.status(500).json({ error: "Vercel 환경변수가 누락되었습니다." });
    }

    const headers = {
      apikey: SUPABASE_SECRET_KEY,
      Authorization: `Bearer ${SUPABASE_SECRET_KEY}`,
      "Content-Type": "application/json"
    };

    async function deleteTable(table, filter) {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/${table}?${filter}`,
        {
          method: "DELETE",
          headers
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`${table} 삭제 실패: ${text}`);
      }
    }

    await deleteTable("saved_recipes", `recipe_id=eq.${recipeId}`);
    await deleteTable("recipe_ingredients", `recipe_id=eq.${recipeId}`);
    await deleteTable("recipe_steps", `recipe_id=eq.${recipeId}`);
    await deleteTable("reviews", `recipe_id=eq.${recipeId}`);
    await deleteTable("recipes", `id=eq.${recipeId}`);

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({
      error: e.message || "관리자 삭제 중 오류가 발생했습니다."
    });
  }
}
