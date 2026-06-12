import { Router, type IRouter } from "express";
import { db, sneakPeeksTable, subscribersTable } from "@workspace/db";
import { insertSneakPeekSchema } from "@workspace/db";
import { sendSneakPeekEmail } from "../lib/email";
import { desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/sneak-peeks", async (req, res) => {
  try {
    const peeks = await db
      .select()
      .from(sneakPeeksTable)
      .orderBy(desc(sneakPeeksTable.createdAt));
    res.json(peeks);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch sneak peeks" });
  }
});

router.post("/sneak-peeks", async (req, res) => {
  const parsed = insertSneakPeekSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid data", details: parsed.error });
    return;
  }

  try {
    const [peek] = await db.insert(sneakPeeksTable).values(parsed.data).returning();

    const subscribers = await db.select({ email: subscribersTable.email }).from(subscribersTable);
    const emails = subscribers.map((s) => s.email);

    if (emails.length > 0) {
      await sendSneakPeekEmail({
        to: emails,
        title: peek.title,
        description: peek.description,
        imageUrl: peek.imageUrl,
      }).catch((err) => req.log.error({ err }, "Email send failed"));
    }

    res.json({ peek, emailsSent: emails.length });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to create sneak peek" });
  }
});

export default router;
