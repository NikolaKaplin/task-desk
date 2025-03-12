"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname, notFound } from "next/navigation"
import Link from "next/link"
import { Users, FileText, LayoutDashboard, LogOut, UserCog, FolderKanban } from "lucide-react"
import { getUserSession } from "@/lib/get-session-server"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    async function checkAdmin() {
      setLoading(true)
      const sessionUser = await getUserSession()
      if (sessionUser?.role !== "ADMIN") {
        router.push("/")
        return {
          notFound: true
        }
      }
      setUser(sessionUser)
      setLoading(false)
    }

    checkAdmin()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Админ-панель</span>
                  <span className="sm:hidden">Панель</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {pathname !== "/admin" && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {pathname.includes("/applications") ? (
                        <>
                          <Users className="h-4 w-4 mr-2" />
                          <span className="hidden sm:inline">Заявки пользователей</span>
                          <span className="sm:hidden">Заявки</span>
                        </>
                      ) : pathname.includes("/posts") ? (
                        <>
                          <FileText className="h-4 w-4 mr-2" />
                          <span className="hidden sm:inline">Модерация постов</span>
                          <span className="sm:hidden">Посты</span>
                        </>
                      ) : pathname.includes("/projects") ? (
                        <>
                          <FolderKanban className="h-4 w-4 mr-2" />
                          <span className="hidden sm:inline">Модерация проектов</span>
                          <span className="sm:hidden">Проекты</span>
                        </>
                      ) : pathname.includes("/users") ? (
                        <>
                          <UserCog className="h-4 w-4 mr-2" />
                          <span className="hidden sm:inline">Управление пользователями</span>
                          <span className="sm:hidden">Пользователи</span>
                        </>
                      ) : (
                        pathname.split("/").pop()
                      )}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        {children}
      </main>
    </div>
  )
}

