"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { getProjects, getUsers } from "@/app/actions";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Users, Plus, Play } from "lucide-react";
import { CreateProjectForm } from "@/components/shared/projects/create-project-form";

interface Project {
  id: string;
  name: string;
  content: string;
  authorId: number;
  createdAt: Date;
  projectStatus: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  avatar: string;
}

function CreateProjectCard() {
  const [isDia, setIsDia] = useState(false);
  const handlerDialog = () => {
    console.log("dialog:" + !isDia);
    setIsDia(!isDia);
  };
  return (
    <div className="hidden lg:flex hover:cursor-pointer">
      <Card
        onClick={() => handlerDialog()}
        className="bg-gray-800 border-gray-700 text-white overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:text-indigo-400 hover:animate-pulse hover:border-indigo-400 group border-dashed border-4"
      >
        <CardContent className="p-4 flex flex-col justify-between h-[calc(100%-12rem)]">
          <h3 className="text-xl font-semibold text-green-400 group-hover:text-indigo-400 transition-colors duration-300 mb-2">
            Создать новый проект
          </h3>
          <p className="text-gray-400 flex-grow">
            Запустите свой следующий большой проект прямо сейчас! Начните с
            чистого листа и создайте что-то невероятное.
          </p>
        </CardContent>
        <CardFooter className="justify-center min-h-full hover:text-indigo-400">
          <Play strokeWidth={1.75} absoluteStrokeWidth />
        </CardFooter>
      </Card>
      <CreateProjectForm isDialogOpen={isDia} setIsDialogOpen={handlerDialog} />
    </div>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDia, setIsDia] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [projectsData, usersData] = await Promise.all([
        getProjects(),
        getUsers(),
      ]);
      if (projectsData) setProjects(projectsData);
      if (usersData) setUsers(usersData);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handlerDialog = () => {
    console.log("dialog:" + !isDia);
    setIsDia(!isDia);
  };

  return (
    <div className="container min-h-screen mx-auto p-4 space-y-6">
      <header className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold text-green-400 text-center">
          Проекты команды
        </h1>
      </header>

      <div className="fixed bottom-8 right-8 lg:hidden z-50">
        <Button
          onClick={() => handlerDialog()}
          className=" bg-gray-800 hover:bg-transparent text-white h-[80px] w-[80px] rounded-full shadow-lg flex items-center justify-center"
        >
          <img
            src="https://img.icons8.com/?size=96&id=A0MYENUyCEId&format=png"
            alt=""
            className="min-w-[80px] min-h-[80px]"
          />
        </Button>
        <CreateProjectForm
          isDialogOpen={isDia}
          setIsDialogOpen={handlerDialog}
        />
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-[400px] w-full" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <CreateProjectCard />
          {projects.map((project) => {
            const creator = users.find((u) => u.id === project.authorId);
            const projectUsers = JSON.parse(project.content)
              .users.map((userId: number) => users.find((u) => u.id === userId))
              .filter(Boolean);
            const excerpt =
              JSON.parse(project.content).description.slice(0, 100) + "...";

            return (
              <Link
                href={`/projects/${project.id}`}
                key={project.id}
                className="group"
              >
                <Card className="bg-gray-800 border-gray-700 text-white overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="relative h-48 bg-gray-700 flex items-center justify-center">
                    <Briefcase className="w-12 h-12 text-gray-500" />
                  </div>
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage
                          src={creator?.avatar}
                          alt={creator?.firstName}
                        />
                        <AvatarFallback>
                          {creator?.firstName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-green-400">
                          {project.name}
                        </CardTitle>
                        <p className="text-sm text-gray-400">
                          {creator?.firstName} •{" "}
                          {new Date(project.createdAt).toDateString()}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{excerpt}</p>
                    <Badge
                      variant={
                        project.projectStatus === "DEVELOPMENT"
                          ? "default"
                          : "secondary"
                      }
                      className="mt-2"
                    >
                      {project.projectStatus === "DEVELOPMENT"
                        ? "В разработке"
                        : "Поддержка"}
                    </Badge>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <Button
                      variant="link"
                      className="text-green-400 hover:text-green-300 transition-colors p-0"
                    >
                      View Tasks
                    </Button>
                    <div className="flex items-center space-x-2">
                      <div className="flex -space-x-3 overflow-hidden">
                        {projectUsers.slice(0, 3).map((user) => (
                          <Avatar
                            key={user.id}
                            className="inline-block border-2 border-gray-800"
                          >
                            <AvatarImage
                              src={user.avatar || "/placeholder.svg"}
                              alt={`${user.firstName} ${user.lastName}`}
                            />
                            <AvatarFallback>
                              {user.firstName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {projectUsers.length > 3 && (
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-800 text-xs text-gray-300">
                            +{projectUsers.length - 3}
                          </div>
                        )}
                      </div>
                      <span className="flex gap-2 text-gray-400">
                        <Users className="w-5 h-5" />
                        {projectUsers.length}
                      </span>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
