import { Router, type IRouter } from "express";
import { db, newsTable } from "@workspace/db";
import { insertNewsSchema } from "@workspace/db";
import { desc, eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/news", async (req, res) => {
  try {
    const items = await db.select().from(newsTable).orderBy(desc(newsTable.createdAt));
    res.json(items);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

router.post("/news", async (req, res) => {
  const parsed = insertNewsSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid data", details: parsed.error });
    return;
  }
  try {
    const [item] = await db.insert(newsTable).values(parsed.data).returning();
    res.json(item);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to create news item" });
  }
});

router.delete("/news/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  try {
    await db.delete(newsTable).where(eq(newsTable.id, id));
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to delete news item" });
  }
});

export default router;
