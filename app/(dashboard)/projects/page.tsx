"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

import { v4 as uuidv4 } from "uuid"
import { CreateProjectForm } from "@/components/shared/projects/create-project-form"
import React from "react"
import { getPosts, getProjects, getUsers } from "@/app/actions"

export async function createProject(name: string, description: string) {
  // In a real application, you would save this to a database
  const newProject = {
    id: uuidv4(),
    name,
    description,
  }

  // Simulate a delay to mimic a database operation
  await new Promise((resolve) => setTimeout(resolve, 500))

  return newProject
}

interface Project {
  id: string
  name: string
  description: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState()
  const [users, setUsers] = useState()
  React.useEffect(() => {
    (async () => {
      const getAllProjects = await getProjects();
      console.log(getAllProjects)
      if (getAllProjects) {
        setProjects(getAllProjects);
      }
    })();
  }, [])

  React.useEffect(() => {
    (async() => {
      const usersArr = await getUsers();
      console.log(usersArr)
      if (usersArr){
        setUsers(usersArr)
      }
    })();
  }, [])

  const handleCreateProject = async (name: string, description: string) => {
    const newProject = await createProject(name, description)
    setProjects([...projects, newProject])
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        {users ? (<CreateProjectForm user={users} onSubmit={handleCreateProject} />) : (<div>Load...</div>)}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects ? ( <div>        {projects.map((project) => (
          <Link href={`/projects/${project.id}`} key={project.id}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  View Tasks
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))} </div>) : (<div>loading</div>)}
      </div>
    </div>
  )
}

