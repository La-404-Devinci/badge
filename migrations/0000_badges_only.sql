-- Migration pour les tables de badges uniquement
-- Les types notification_method, date_format, time_format, etc. existent déjà

CREATE TABLE "badge_type" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"display_name" text NOT NULL,
	"description" text NOT NULL,
	"icon" text NOT NULL,
	"color" text NOT NULL,
	"max_level" integer DEFAULT 100 NOT NULL,
	"base_exp" integer DEFAULT 100 NOT NULL,
	"exp_multiplier" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "badge_type_name_unique" UNIQUE("name")
);

CREATE TABLE "exp_gain" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"badge_type_id" text NOT NULL,
	"source_type" text NOT NULL,
	"source_id" text,
	"exp_amount" integer NOT NULL,
	"previous_level" integer NOT NULL,
	"new_level" integer NOT NULL,
	"description" text,
	"metadata" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "project_badge_reward" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"badge_type_id" text NOT NULL,
	"exp_reward" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "user_badge" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"badge_type_id" text NOT NULL,
	"current_level" integer DEFAULT 1 NOT NULL,
	"current_exp" integer DEFAULT 0 NOT NULL,
	"total_exp" integer DEFAULT 0 NOT NULL,
	"exp_to_next_level" integer DEFAULT 100 NOT NULL,
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Ajouter les contraintes de clés étrangères
ALTER TABLE "exp_gain" ADD CONSTRAINT "exp_gain_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "exp_gain" ADD CONSTRAINT "exp_gain_badge_type_id_badge_type_id_fk" FOREIGN KEY ("badge_type_id") REFERENCES "public"."badge_type"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "project_badge_reward" ADD CONSTRAINT "project_badge_reward_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "project_badge_reward" ADD CONSTRAINT "project_badge_reward_badge_type_id_badge_type_id_fk" FOREIGN KEY ("badge_type_id") REFERENCES "public"."badge_type"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "user_badge" ADD CONSTRAINT "user_badge_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "user_badge" ADD CONSTRAINT "user_badge_badge_type_id_badge_type_id_fk" FOREIGN KEY ("badge_type_id") REFERENCES "public"."badge_type"("id") ON DELETE cascade ON UPDATE no action;
