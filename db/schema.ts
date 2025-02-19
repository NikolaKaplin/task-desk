import {
  mysqlTable,
  varchar,
  boolean,
  text,
  timestamp,
  json,
} from "drizzle-orm/mysql-core";
import { createId as cuid } from "@paralleldrive/cuid2";

type UserRole = "USER" | "ADMIN" | "UNVERIFIED";

export const userTable = mysqlTable("user", {
  id: varchar("id", { length: 256 }).primaryKey().$default(cuid),
  firstName: varchar("firstName", { length: 20 }).notNull(),
  lastName: varchar("lastName", { length: 20 }).notNull(),
  bio: text("bio").default(""),
  devStatus: varchar("devStatus", { length: 256 }).default("").notNull(),
  isPublic: boolean("isPublic").default(false),
  email: varchar("email", { length: 127 }).unique().notNull(),
  passwordHash: varchar("password_hash", { length: 127 }).notNull(),
  avatarUrl: varchar("avatar_url", { length: 256 }),
  role: varchar("role", { length: 16 })
    .$type<UserRole>()
    .default("UNVERIFIED")
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
  contacts: json("contacts").notNull(),
});

type ProjectStatus = "DEVELOPMENT" | "PRODUCTION";

export const projectTable = mysqlTable("project", {
  id: varchar("id", { length: 25 }).primaryKey().$default(cuid),
  name: varchar("name", { length: 256 }).unique().notNull(),
  content: json("content").notNull(),
  authorId: varchar("authorId", { length: 25 }).references(() => userTable.id, {
    onDelete: "set null",
  }),
  projectStatus: varchar("projectStatus", { length: 16 })
    .$type<ProjectStatus>()
    .default("DEVELOPMENT")
    .notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

type TaskStatus = "ISSUED" | "PROCESSING" | "REVIEW" | "DONE";
export const taskTable = mysqlTable("task", {
  id: varchar("id", { length: 25 }).primaryKey().$default(cuid),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description").notNull(),
  authorId: varchar("authorId", { length: 25 }).references(() => userTable.id, {
    onDelete: "set null",
  }),
  performers: json("performers").notNull(),
  image: varchar("image", { length: 256 }).default("").notNull(),
  taskStatus: varchar("taskStatus", { length: 16 })
    .$type<TaskStatus>()
    .default("ISSUED"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
  deadline: timestamp("deadline").notNull(),
  projectId: varchar("projectId", { length: 25 })
    .references(() => projectTable.id, {
      onDelete: "cascade",
    })
    .notNull(),
});

type postStatus = "EXPECTATION" | "APPROVED";

export const postTable = mysqlTable("post", {
  id: varchar("id", { length: 25 }).primaryKey().$default(cuid),
  name: varchar("name", { length: 256 }).notNull(),
  content: json("content").notNull(),
  authorId: varchar("authorId", { length: 25 }).references(() => userTable.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("createdAt").defaultNow(),
  postStatus: varchar("postStatus", { length: 16 })
    .$type<postStatus>()
    .default("EXPECTATION")
    .notNull(),
});

export const thirdPartyTokensTable = mysqlTable("third_party_tokens", {
  id: varchar("id", { length: 25 }).primaryKey(),
  service: varchar("service", { length: 256 }).notNull(),
  accessToken: varchar("accessToken", { length: 256 }).notNull(),
  refreshToken: varchar("refreshToken", { length: 256 }).notNull(),
});
