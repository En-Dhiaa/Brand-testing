import { randomUUID } from "crypto";
import { pgTable, text, integer, timestamp, index, uniqueIndex } from "drizzle-orm/pg-core";

const id = () =>
  text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID());

const createdAt = () => timestamp("created_at", { withTimezone: true }).notNull().defaultNow();
const updatedAt = () =>
  timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date());

export const proposals = pgTable(
  "proposals",
  {
    id: id(),
    publicId: text("public_id").notNull().unique(),
    design: text("design").notNull(), // JSON string containing logoVersion, background, and component parts
    previewUrl: text("preview_url"),
    pngUrl: text("png_url"),
    jpgUrl: text("jpg_url"),
    status: text("status").notNull().default("PUBLISHED"), // PUBLISHED, HIDDEN, DELETED
    likesCount: integer("likes_count").notNull().default(0),
    votesCount: integer("votes_count").notNull().default(0),
    commentsCount: integer("comments_count").notNull().default(0),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    index("proposals_status_idx").on(t.status),
    index("proposals_created_at_idx").on(t.createdAt),
    index("proposals_votes_count_idx").on(t.votesCount),
    index("proposals_likes_count_idx").on(t.likesCount),
  ]
);

export const likes = pgTable(
  "likes",
  {
    id: id(),
    proposalId: text("proposal_id")
      .notNull()
      .references(() => proposals.id, { onDelete: "cascade" }),
    visitorId: text("visitor_id").notNull(),
    createdAt: createdAt(),
  },
  (t) => [
    uniqueIndex("likes_proposal_visitor_key").on(t.proposalId, t.visitorId),
    index("likes_proposal_id_idx").on(t.proposalId),
  ]
);

export const votes = pgTable(
  "votes",
  {
    id: id(),
    proposalId: text("proposal_id")
      .notNull()
      .references(() => proposals.id, { onDelete: "cascade" }),
    voterId: text("voter_id").notNull(),
    createdAt: createdAt(),
  },
  (t) => [
    uniqueIndex("votes_proposal_voter_key").on(t.proposalId, t.voterId),
    index("votes_proposal_id_idx").on(t.proposalId),
  ]
);

export const comments = pgTable(
  "comments",
  {
    id: id(),
    proposalId: text("proposal_id")
      .notNull()
      .references(() => proposals.id, { onDelete: "cascade" }),
    visitorId: text("visitor_id").notNull(),
    userName: text("user_name").notNull().default("مشارك"),
    content: text("content").notNull(),
    status: text("status").notNull().default("APPROVED"), // APPROVED, HIDDEN, DELETED, PENDING
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    index("comments_proposal_id_idx").on(t.proposalId),
    index("comments_status_idx").on(t.status),
  ]
);

export const adminUsers = pgTable("admin_users", {
  id: id(),
  email: text("email").notNull().unique(),
  name: text("name").notNull().default("مدير النظام"),
  passwordHash: text("password_hash").notNull(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const adminActions = pgTable("admin_actions", {
  id: id(),
  adminEmail: text("admin_email").notNull(),
  action: text("action").notNull(),
  targetId: text("target_id"),
  details: text("details"),
  createdAt: createdAt(),
});

export const systemSettings = pgTable("system_settings", {
  id: id(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: updatedAt(),
});
