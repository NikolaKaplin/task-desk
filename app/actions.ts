"use server";

import "dotenv/config";
import { postTable, projectTable, taskTable, userTable } from "@/db/schema";
import { db } from "@/db";
import { desc, eq } from "drizzle-orm";
import { console } from "inspector";

type RegisterResult = {
  success: boolean;
};

type ProfileEdited = {
  edit: boolean;
};

type PostData = {
  name: string;
  authorId: number;
  content: string;
};

type Task = {
  id: number;
  title: string;
  authorId: number;
  description: string;
  projectId: number;
  taskStatus: string;
  createdAt: Date;
  performers: string;
  image?: string;
  updatedAt: Date;
  deadline: Date;
};

export type User = typeof userTable.$inferSelect;
export async function registerUser(
  body: typeof userTable.$inferInsert
): Promise<RegisterResult> {
  try {
    const [user] = await db
      .selectDistinct()
      .from(userTable)
      .where(eq(userTable.email, body.email));
    console.log(user);
    if (user) {
      return { success: false };
    } else {
      console.log(body);
      const createdUser = await db.insert(userTable).values(body);
      await sendApplication(body);
      return { success: !!createdUser };
    }
  } catch (error) {
    const createdUser = await db.insert(userTable).values(body);
    await sendApplication(body);
    return { success: true };
  }
}

export async function Applications() {
  const usersWithRoleUser = await db
    .select()
    .from(userTable)
    .where(eq(userTable.role, "UNVERIFIED"));
  return usersWithRoleUser.map((user) => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  }));
}

export type UpdateProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  devStatus: string;
};

export async function updateProfile(
  body: UpdateProfile
): Promise<ProfileEdited> {
  try {
    console.log("body:" + body);
    await db
      .update(userTable)
      .set({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        bio: body.bio,
        devStatus: body.devStatus?.toString(),
      })
      .where(eq(userTable.id, body.id));
    return { edit: true };
  } catch (error) {
    return { edit: false };
  }
}

export async function confirmUser(body, isDelete: boolean) {
  const [user] = await db
    .selectDistinct()
    .from(userTable)
    .where(eq(userTable.email, body.email));

  if (user) {
    if (isDelete) {
      await db.delete(userTable).where(eq(userTable.email, body.email));
    } else {
      await db
        .update(userTable)
        .set({
          role: "USER",
        })
        .where(eq(userTable.email, body.email));
    }
  }
}

export async function getUserInfoById(id: string) {
  const [userInfo] = await db
    .select({
      firstName: userTable.firstName,
      lastName: userTable.lastName,
      bio: userTable.bio,
      avatar: userTable.avatarUrl,
      devStatus: userTable.devStatus,
    })
    .from(userTable)
    .where(eq(userTable.id, id));
  return userInfo;
}

export async function countUnverifiedUsers() {
  const usersWithRoleUser = await db.$count(
    userTable,
    eq(userTable.role, "UNVERIFIED")
  );
  return usersWithRoleUser;
}

export async function setConfidentiality(id: string, isPublic: boolean) {
  const response = await db
    .update(userTable)
    .set({
      isPublic: isPublic,
    })
    .where(eq(userTable.id, id));
  return response;
}

export async function setUserAvatar(userId: string, avatar: string) {
  await db
    .update(userTable)
    .set({ avatarUrl: avatar })
    .where(eq(userTable.id, userId));
}

export async function getUsers() {
  const users = await db.select().from(userTable);
  return users.map((user) => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    bio: user.bio,
    avatar: user.avatarUrl,
    role: user.role,
    devStatus: user.devStatus,
  }));
}

export async function getUserInfo(firsName: string, lastName: string) {
  const [userInfo] = await db
    .select()
    .from(userTable)
    .where(
      eq(userTable.firstName, firsName) && eq(userTable.lastName, lastName)
    );
  console.log(userInfo);
  return userInfo;
}

export async function postCreate(body: PostData): Promise<RegisterResult> {
  const createPost = await db.insert(postTable).values(body).$returningId();
  if (createPost) {
    return { success: !!createPost };
  } else {
    return { success: false };
  }
}

export async function getPosts() {
  const response = await db
    .select({
      id: postTable.id,
      name: postTable.name,
      authorId: postTable.authorId,
      postStatus: postTable.postStatus,
      content: postTable.content,
      createdAt: postTable.createdAt,
    })
    .from(postTable);
  return response;
}

export async function getPostById(id: string) {
  const [post] = await db
    .selectDistinct()
    .from(postTable)
    .where(eq(postTable.id, id));
  return post;
}

export async function getLastPostId() {
  const [lastPost] = await db
    .select()
    .from(postTable)
    .orderBy(desc(postTable.id));
  return lastPost.id;
}

export async function updatePostStatusById(id: string, isUpdate: boolean) {
  if (isUpdate) {
    await db
      .update(postTable)
      .set({
        postStatus: "APPROVED",
      })
      .where(eq(postTable.id, id));
  } else {
    await db.delete(postTable).where(eq(postTable.id, id));
  }
}

export async function createProject(data) {
  const projectCreate = await db
    .insert(projectTable)
    .values(data)
    .$returningId();
  if (projectCreate) return { success: true };
  return { success: false };
}

export async function getProjects() {
  const projects = await db.select().from(projectTable);
  return projects.map((project) => ({
    id: project.id,
    name: project.name,
    authorId: project.authorId,
    content: project.content,
    createdAt: project.createdAt,
    projectStatus: project.projectStatus,
  }));
}

export async function createTask(data: Task) {
  const taskCreate = await db.insert(taskTable).values(data).$returningId();
  if (taskCreate) return { success: true };
  return { success: false };
}

export async function getTasksByProjectId(id: string) {
  const tasks = await db
    .select()
    .from(taskTable)
    .where(eq(taskTable.projectId, id));
  return tasks;
}

export async function getProjectById(id: string) {
  const [project] = await db
    .select()
    .from(projectTable)
    .where(eq(projectTable.id, id));
  return project;
}

export async function updateTask(body: any) {
  await db
    .update(taskTable)
    .set({
      title: body.title,
      description: body.description,
      performers: body.performers,
      deadline: body.deadline,
      updatedAt: new Date(),
    })
    .where(eq(taskTable.id, body.id));
}

export async function updateTaskStatusById(
  id: string,
  status: string,
  date: Date
) {
  await db
    .update(taskTable)
    .set({
      taskStatus: status,
      updatedAt: date,
    })
    .where(eq(taskTable.id, id));
}

export async function sendApplication(message: any) {
  const email = "`" + message.email + "`";
  const formApplication = `
  *Имя:* ${message.firstName}\n*Фамилия:* ${message.lastName}\n*Email:* ${email}`;
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${
        process.env.TELEGRAM_BOT_TOKEN
      }/sendMessage?chat_id=${process.env.CHAT_ID}&text=${encodeURI(
        formApplication
      )}&parse_mode=Markdown`
    );
    if (res) return res;
  } catch (error) {
    console.log(error);
  }
}
