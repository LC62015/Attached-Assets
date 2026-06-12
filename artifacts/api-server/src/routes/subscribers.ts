import { Router, type IRouter } from "express";
import { db, subscribersTable } from "@workspace/db";
import { insertSubscriberSchema } from "@workspace/db";

const router: IRouter = Router();

router.post("/subscribe", async (req, res) => {
  const parsed = insertSubscriberSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid email address" });
    return;
  }

  try {
    await db
      .insert(subscribersTable)
      .values(parsed.data)
      .onConflictDoNothing({ target: subscribersTable.email });
    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to subscribe" });
  }
});

export default router;
