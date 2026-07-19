import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const STATUSES = ["a_acheter", "achete", "a_prendre", "pris"] as const;
export type Status = (typeof STATUSES)[number];

export const STATUS_LABELS: Record<Status, string> = {
  a_acheter: "À acheter",
  achete: "Acheté",
  a_prendre: "À prendre",
  pris: "Pris",
};

export const CATEGORIES = [
  "video",
  "audio",
  "eclairage",
  "energie",
  "cables",
  "reseau",
  "transport",
  "divers",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  video: "Vidéo",
  audio: "Audio",
  eclairage: "Éclairage",
  energie: "Énergie",
  cables: "Câbles",
  reseau: "Réseau",
  transport: "Transport",
  divers: "Divers",
};

export const items = pgTable("items", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  imageUrl: text("image_url"),
  priceCents: integer("price_cents"),
  link: text("link"),
  category: text("category").notNull().default("divers"),
  quantity: integer("quantity").notNull().default(1),
  status: text("status").$type<Status>().notNull().default("a_acheter"),
  assignedTo: text("assigned_to"),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;
