import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const sneakPeeksTable = pgTable("sneak_peeks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSneakPeekSchema = createInsertSchema(sneakPeeksTable).omit({ id: true, createdAt: true });
export type InsertSneakPeek = z.infer<typeof insertSneakPeekSchema>;
export type SneakPeek = typeof sneakPeeksTable.$inferSelect;
