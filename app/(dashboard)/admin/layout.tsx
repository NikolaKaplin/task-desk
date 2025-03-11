"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Users,
  FileText,
  LayoutDashboard,
  LogOut,
  UserCog,
} from "lucide-react";
import { getUserSession } from "@/lib/get-session-server";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function checkAdmin() {
      setLoading(true);
      const sessionUser = await getUserSession();
      if (sessionUser?.role !== "ADMIN") {
        router.push("/");
        return;
      }
      setUser(sessionUser);
      setLoading(false);
    }

    checkAdmin();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col md:flex-row">
      {/* Боковая панель навигации */}
      <aside className="bg-gray-900 text-white w-full md:w-64 md:min-h-screen p-4 md:p-6">
        <div className="flex flex-col h-full">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-green-400">
              Панель администратора
            </h1>
            <p className="text-gray-400 mt-2">
              Добро пожаловать, {user?.firstName || "Администратор"}
            </p>
          </div>

          {/* Навигация */}
          <nav className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2 overflow-x-auto md:overflow-visible pb-4 md:pb-0">
            <Link href="/admin" className="flex-shrink-0">
              <Button
                variant={pathname === "/admin" ? "default" : "ghost"}
                className="w-full justify-start"
              >
                <LayoutDashboard className="mr-2 h-5 w-5" />
                Обзор
              </Button>
            </Link>
            <Link href="/admin/applications" className="flex-shrink-0">
              <Button
                variant={
                  pathname === "/admin/applications" ? "default" : "ghost"
                }
                className="w-full justify-start"
              >
                <Users className="mr-2 h-5 w-5" />
                Заявки пользователей
              </Button>
            </Link>
            <Link href="/admin/posts" className="flex-shrink-0">
              <Button
                variant={pathname === "/admin/posts" ? "default" : "ghost"}
                className="w-full justify-start"
              >
                <FileText className="mr-2 h-5 w-5" />
                Модерация постов
              </Button>
            </Link>
            <Link href="/admin/users" className="flex-shrink-0">
              <Button
                variant={pathname === "/admin/users" ? "default" : "ghost"}
                className="w-full justify-start"
              >
                <UserCog className="mr-2 h-5 w-5" />
                Пользователи
              </Button>
            </Link>
          </nav>

          <div className="mt-auto pt-6">
            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={() => router.push("/logout")}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Выйти
            </Button>
          </div>
        </div>
      </aside>

      {/* Основной контент */}
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
                          <span className="hidden sm:inline">
                            Заявки пользователей
                          </span>
                          <span className="sm:hidden">Заявки</span>
                        </>
                      ) : pathname.includes("/posts") ? (
                        <>
                          <FileText className="h-4 w-4 mr-2" />
                          <span className="hidden sm:inline">
                            Модерация постов
                          </span>
                          <span className="sm:hidden">Посты</span>
                        </>
                      ) : pathname.includes("/users") ? (
                        <>
                          <UserCog className="h-4 w-4 mr-2" />
                          <span className="hidden sm:inline">
                            Управление пользователями
                          </span>
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
  );
}
