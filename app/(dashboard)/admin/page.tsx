"use client"

import { useEffect, useState } from "react"
import { Applications, getPosts, getProjects, getUsers } from "../../actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, Clock, AlertTriangle, FolderKanban } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingApplications: 0,
    totalPosts: 0,
    pendingPosts: 0,
    totalProjects: 0,
  })

  useEffect(() => {
    async function fetchStats() {
      const [users, applications, posts, projects] = await Promise.all([getUsers(), Applications(), getPosts(), getProjects()])

      const pendingPosts = posts.filter((post) => post.postStatus !== "APPROVED")

      setStats({
        totalUsers: users.length,
        pendingApplications: applications.length,
        totalPosts: posts.length,
        pendingPosts: pendingPosts.length,
        totalProjects: projects.length
      })
    }

    fetchStats()
  }, [])

  return (
    <div className="max-w-[1800px] mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Обзор системы</h1>
        <p className="text-gray-400">
          Панель управления с ключевыми показателями и быстрым доступом к основным функциям
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Пользователи"
          href="/admin/users"
          value={stats.totalUsers}
          icon={<Users className="h-8 w-8 text-blue-400" />}
          color="blue"
        />
        <StatCard
          title="Заявки на регистрацию"
          value={stats.pendingApplications}
          icon={<Clock className="h-8 w-8 text-green-400" />}
          color="green"
          href="/admin/applications"
          alert={stats.pendingApplications > 0}
        />
        <StatCard
          href='/admin/posts'
          title="Всего постов"
          value={stats.totalPosts}
          icon={<FileText className="h-8 w-8 text-purple-400" />}
          color="purple"
        />
        <StatCard
          title="Ожидают модерации"
          value={stats.pendingPosts}
          icon={<AlertTriangle className="h-8 w-8 text-yellow-400" />}
          color="yellow"
          href="/admin/posts"
          alert={stats.pendingPosts > 0}
        />
        <StatCard

        
          title="Модерация проектов"
          value={stats.totalProjects}
          icon={<FolderKanban className="h-8 w-8 text-yellow-400" />}
          color="yellow"
          href="/admin/projects"
          alert={stats.totalProjects > 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader>
            <CardTitle className="text-green-400">Управление заявками пользователей</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              Просмотр и обработка заявок на регистрацию новых пользователей.
              {stats.pendingApplications > 0 && (
                <span className="text-green-400 font-medium">
                  {" "}
                  В настоящее время ожидают рассмотрения {stats.pendingApplications} заявок.
                </span>
              )}
            </p>
            <Link href="/admin/applications">
              <Button color="green">Перейти к заявкам</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader>
            <CardTitle className="text-yellow-400">Модерация постов</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              Просмотр и модерация постов, ожидающих публикации.
              {stats.pendingPosts > 0 && (
                <span className="text-yellow-400 font-medium">
                  {" "}
                  В настоящее время ожидают модерации {stats.pendingPosts} постов.
                </span>
              )}
            </p>
            <Link href="/admin/posts">
              <Button color="yellow">Перейти к модерации</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, color, href, alert = false }) {
  const colorClasses = {
    blue: "bg-blue-400/10 border-blue-400/20",
    green: "bg-green-400/10 border-green-400/20",
    purple: "bg-purple-400/10 border-purple-400/20",
    yellow: "bg-yellow-400/10 border-yellow-400/20",
  }

  const Content = (
    <Card className={`${colorClasses[color]} border text-white`}>
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className="relative">
          {icon}
          {alert && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>}
        </div>
      </CardContent>
    </Card>
  )

  if (href) {
    return <Link href={href}>{Content}</Link>
  }

  return Content
}

function Button({ children, color = "blue", ...props }) {
  const colorClasses = {
    blue: "bg-blue-600 hover:bg-blue-700",
    green: "bg-green-600 hover:bg-green-700",
    yellow: "bg-yellow-600 hover:bg-yellow-700",
    red: "bg-red-600 hover:bg-red-700",
  }

  return (
    <button
      className={`${colorClasses[color]} px-4 py-2 rounded-md text-white font-medium transition-colors`}
      {...props}
    >
      {children}
    </button>
  )
}

