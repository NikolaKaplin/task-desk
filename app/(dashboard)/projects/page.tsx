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
import { CreateProjectForm } from "@/components/shared/projects/create-project-form";
import { getProjects, getUsers } from "@/app/actions";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Users } from "lucide-react";

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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="container mx-auto p-4 space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-green-400">Projects</h1>
        {users.length > 0 ? (
          <CreateProjectForm />
        ) : (
          <Skeleton className="h-10 w-[140px]" />
        )}
      </header>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <Card
              key={index}
              className="bg-gray-800 border-gray-700 text-white"
            >
              <div className="h-48 bg-gray-700" />
              <CardHeader>
                <Skeleton className="h-6 w-2/3 mb-2 bg-gray-700" />
                <Skeleton className="h-4 w-full bg-gray-700" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2 bg-gray-700" />
                <Skeleton className="h-4 w-2/3 bg-gray-700" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full bg-gray-700" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : projects.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                      <span className=" flex gap-2 text-gray-400">
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
      ) : (
        <div className="text-center py-10">
          <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-lg font-semibold text-white">
            No projects yet
          </h2>
          <p className="mt-2 text-gray-400">
            Get started by creating a new project.
          </p>
          <CreateProjectForm />
        </div>
      )}
    </div>
  );
}
