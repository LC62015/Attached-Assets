import { Router, type IRouter } from "express";
import { db, subscribersTable } from "@workspace/db";
import { sendGameUpdateEmail } from "../lib/email";

const router: IRouter = Router();

router.post("/email-blast", async (req, res) => {
  const { subject, headline, body, imageUrl } = req.body as {
    subject: string;
    headline: string;
    body: string;
    imageUrl?: string;
  };

  if (!subject || !headline || !body) {
    res.status(400).json({ error: "subject, headline, and body are required" });
    return;
  }

  try {
    const subscribers = await db.select({ email: subscribersTable.email }).from(subscribersTable);
    const emails = subscribers.map((s) => s.email);

    if (emails.length > 0) {
      await sendGameUpdateEmail({ to: emails, subject, headline, body, imageUrl: imageUrl || null });
    }

    res.json({ success: true, emailsSent: emails.length });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to send email blast" });
  }
});

export default router;
