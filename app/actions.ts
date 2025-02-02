"use server";

import { prisma } from "@/prisma/prisma-client";
import { hashSync } from "bcryptjs";
import { cookies } from "next/headers";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { writeFile } from "fs/promises";
import path from "path";
import { ConstantColorFactor } from "three";
import { equal } from "assert";
import { Code } from "lucide-react";
import { InputJsonValue, JsonValue } from "@prisma/client/runtime/library";

export async function registerUser(
  body: Prisma.UserCreateInput
): Promise<RegisterResult> {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if (user) {
      return { success: false };
    } else {
      const createdUser = await prisma.user.create({
        data: {
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          password: hashSync(body.password, 10),
          bio: "",
          devStatus: "",
        },
      });
      const res = await sendApplication(body)
      console.log(res)
      return { success: !!createdUser };
    }
  } catch (err) {
    return { success: false };
  }
}

export async function Applications() {
  try {
    const usersWithRoleUser = await prisma.user.findMany({
      where: {
        role: {
          equals: "UNVERIFIED",
        },
      },
    });
    return usersWithRoleUser;
  } catch (err) {
    console.error(err);
  }
}

export async function updateProfile(
  body: Prisma.UserUncheckedUpdateInput
): Promise<ProfileEdited> {
  try {
    console.log(body);
    await prisma.user.update({
      where: {
        id: body.id,
      },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        bio: body.bio,
        devStatus: body.devStatus?.toString(),
      },
    });
    revalidatePath("/profile");
    return { edit: true };
  } catch (err) {
    console.error(err);
    return { edit: false };
  }
}

export async function confirmUser(
  body: Prisma.UserUpdateInput,
  isDelete: boolean
) {

  const user = await prisma.user.findFirst({
    where: {
      email: body.email as string,
    },
  });

  if (!user) {
    throw new Error(`User with email ${body.email} not found`);
  }


  if (isDelete) {
    await prisma.user.deleteMany({
      where: {
        email: body.email as string,
      },
    });
    prisma.$disconnect();
  } else {
    await prisma.user.updateMany({
      where: {
        email: body.email as string,
      },
      data: {
        role: "USER",
      },
    });
    prisma.$disconnect();
  }
}

type RegisterResult = {
  success: boolean;
};

type ProfileEdited = {
  edit: boolean;
};

export async function countUnverifiedUsers() {
  const usersWithRoleUser = await prisma.user.count({
    where: {
      role: {
        equals: "UNVERIFIED",
      },
    },
  });
  return usersWithRoleUser;
}

export async function setConfidentiality(id: number, isPublic: boolean) {
  try{
    const response = await prisma.user.update({
      where: {
        id: id
      },
      data: {
        isPublic: isPublic,
      }
    })
    if(response){
      return {success: true}
    }
  }catch(error){
    return {success: false}
  }
}

export async function setUserAvatar(userId: number, avatar: string) {
  const response = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      avatar: avatar,
    },
  });
  return response;
}

export async function getUsers() {
  try {
    const response = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatar: true,
        bio: true,
        devStatus: true,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function getUserInfo(firsName: string, lastName: string) {
  try {
    const response = await prisma.user.findFirst({
      where: {
        firstName: firsName,
        lastName: lastName,
      },
      select: {
        firstName: true,
        lastName: true,
        bio: true,
        avatar: true,
        devStatus: true,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
}

type PostData = {
  title: string;
  userId: number;
  content: string;
};

export async function postCreate(body: PostData): Promise<RegisterResult> {
  try {
    const createPost = await prisma.post.create({
      data: {
        name: body.title,
        authorId: body.userId,
        content: body.content,
      },
    });
    return { success: !!createPost };
  } catch (error) {
    return { success: false };
  }
}

type Posts = {
  id: number;
  name: string;
  authorId: number;
  content: string;
  createdAt: Date;
};
export async function getPosts() {
  try {
    const response: Posts = await prisma.post.findMany({
      select: {
        id: true,
        name: true,
        authorId: true,
        content: true,
        createdAt: true,
      },
    });
    return response;
  } catch (error) {}
}

export async function getUserInfoById(id: number) {
  try {
    const response = await prisma.user.findFirst({
      where: {
        id: id,
      },
      select: {
        firstName: true,
        lastName: true,
        bio: true,
        avatar: true,
        devStatus: true,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
}

export async function getPostById(id: number) {
  try {
    const post = await prisma.post.findFirst({
      where: {
        id: id,
      },
    });
    return post;
  } catch (error) {
    console.log("Get Post failed");
  }
}

export async function getLastPostId() {
  try {
    const lastPost = await prisma.post.findFirst({
      orderBy: {
        id: "desc",
      },
    });
    return lastPost;
  } catch (error) {
    console.log(error);
  }
}

export type Project = {
  name: string;
  content: InputJsonValue;
  authorId: number;
  projectStatus: string;
  createdAt: Date;
};
export async function createProject(data: Project) {
  try {
    const projectCreate = await prisma.project.create({
      data: {
        name: data.name,
        content: data.content,
        authorId: data.authorId,
        projectStatus: "DEVELOPMENT" || "PRODUCTION",
        createdAt: data.createdAt,
      },
    });
    if (projectCreate) {
      return { success: true };
    }
  } catch (error) {
    return { success: false };
  }
}

export async function getProjects() {
  try {
    const projectsGet = await prisma.project.findMany({
      select: {
        id: true,
        name: true,
        authorId: true,
        content: true,
        createdAt: true,
        projectStatus: true,
      },
    });
    return projectsGet;
  } catch (error) {
    console.log(error);
  }
}

type Task = {
  title: string;
  authorId: number;
  content: string;
  projectId: number;
  taskStatus: string;
  createdAt: Date;
};
export async function createTask(data: Task) {
  console.log("penis");
  try {
    const taskCreate = await prisma.task.create({
      data: {
        title: data.title,
        authorId: data.authorId,
        content: data.content,
        projectId: data.projectId,
        createdAt: data.createdAt,
        updatedAt: new Date(),
        taskStatus: "ISSUED",
      },
    });
    if (taskCreate) {
      return { success: true };
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getTasksByProjectId(id: number) {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        projectId: id,
      },
      select: {
        id: true,
        title: true,
        authorId: true,
        content: true,
        taskStatus: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return tasks;
  } catch (error) {
    return error;
  }
}

export async function sendApplication(message: any) {
  const email = '`' + message.email + '`';
  const formApplication = `
  *Имя:* ${message.firstName}\n*Фамилия:* ${message.lastName}\n*Email:* ${email}`;
  try{
    const res = await await fetch(`https://api.telegram.org/bot8161546974:AAGY1YsmJEKdw79_js9caNrHwhU-8YcynUQ/sendMessage?chat_id=5791279590&text=${encodeURI(formApplication)}&parse_mode=Markdown`)
    if (res) return res
  } catch (error) {
    console.log(error)
  }
}
