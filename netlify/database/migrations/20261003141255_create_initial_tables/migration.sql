CREATE TABLE "admin_actions" (
	"id" text PRIMARY KEY,
	"admin_email" text NOT NULL,
	"action" text NOT NULL,
	"target_id" text,
	"details" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" text PRIMARY KEY,
	"email" text NOT NULL UNIQUE,
	"name" text DEFAULT 'مدير النظام' NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" text PRIMARY KEY,
	"proposal_id" text NOT NULL,
	"visitor_id" text NOT NULL,
	"user_name" text DEFAULT 'مشارك' NOT NULL,
	"content" text NOT NULL,
	"status" text DEFAULT 'APPROVED' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "likes" (
	"id" text PRIMARY KEY,
	"proposal_id" text NOT NULL,
	"visitor_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "proposals" (
	"id" text PRIMARY KEY,
	"public_id" text NOT NULL UNIQUE,
	"design" text NOT NULL,
	"preview_url" text,
	"png_url" text,
	"jpg_url" text,
	"status" text DEFAULT 'PUBLISHED' NOT NULL,
	"likes_count" integer DEFAULT 0 NOT NULL,
	"votes_count" integer DEFAULT 0 NOT NULL,
	"comments_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "system_settings" (
	"id" text PRIMARY KEY,
	"key" text NOT NULL UNIQUE,
	"value" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "votes" (
	"id" text PRIMARY KEY,
	"proposal_id" text NOT NULL,
	"voter_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "comments_proposal_id_idx" ON "comments" ("proposal_id");--> statement-breakpoint
CREATE INDEX "comments_status_idx" ON "comments" ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "likes_proposal_visitor_key" ON "likes" ("proposal_id","visitor_id");--> statement-breakpoint
CREATE INDEX "likes_proposal_id_idx" ON "likes" ("proposal_id");--> statement-breakpoint
CREATE INDEX "proposals_status_idx" ON "proposals" ("status");--> statement-breakpoint
CREATE INDEX "proposals_created_at_idx" ON "proposals" ("created_at");--> statement-breakpoint
CREATE INDEX "proposals_votes_count_idx" ON "proposals" ("votes_count");--> statement-breakpoint
CREATE INDEX "proposals_likes_count_idx" ON "proposals" ("likes_count");--> statement-breakpoint
CREATE UNIQUE INDEX "votes_proposal_voter_key" ON "votes" ("proposal_id","voter_id");--> statement-breakpoint
CREATE INDEX "votes_proposal_id_idx" ON "votes" ("proposal_id");--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_proposal_id_proposals_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "proposals"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_proposal_id_proposals_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "proposals"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_proposal_id_proposals_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "proposals"("id") ON DELETE CASCADE;