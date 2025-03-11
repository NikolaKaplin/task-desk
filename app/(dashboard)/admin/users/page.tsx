"use client"

import { useEffect, useState } from "react"
import { Search, ArrowLeft, ArrowRight, UserCog, Shield, Mail } from "lucide-react"
import { getUsers } from "../../../actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRole, setSelectedRole] = useState("all")
  const usersPerPage = 10

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const fetchedUsers = await getUsers()
      setUsers(fetchedUsers)
      setFilteredUsers(fetchedUsers)
      setLoading(false)
    }

    fetchData()
  }, [])

  useEffect(() => {
    let filtered = [...users]

    // Filter by role
    if (selectedRole !== "all") {
      filtered = filtered.filter((user) => user.role === selectedRole)
    }

    // Apply search
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (user) =>
          user.firstName?.toLowerCase().includes(query) ||
          user.lastName?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query),
      )
    }

    setFilteredUsers(filtered)
    setCurrentPage(1) // Reset to first page on filter change
  }, [searchQuery, users, selectedRole])

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  // Role counts
  const roleCounts = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1
    return acc
  }, {})

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="max-w-[1800px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-400 mb-2">Управление пользователями</h1>
          <p className="text-gray-400 text-sm">Просмотр и управление учетными записями пользователей системы</p>
        </div>
        <div className="relative w-full sm:w-64 md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Поиск по имени или email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gray-800 border-gray-700 text-white" onClick={() => setSelectedRole("all")}>
          <CardContent className="p-6 flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium text-gray-400">Все пользователи</p>
              <h3 className="text-2xl font-bold mt-1">{users.length}</h3>
            </div>
            <div className="bg-blue-400/10 p-3 rounded-full">
              <UserCog className="h-6 w-6 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 text-white" onClick={() => setSelectedRole("ADMIN")}>
          <CardContent className="p-6 flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium text-gray-400">Администраторы</p>
              <h3 className="text-2xl font-bold mt-1">{roleCounts.ADMIN || 0}</h3>
            </div>
            <div className="bg-purple-400/10 p-3 rounded-full">
              <Shield className="h-6 w-6 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 text-white" onClick={() => setSelectedRole("USER")}>
          <CardContent className="p-6 flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium text-gray-400">Пользователи</p>
              <h3 className="text-2xl font-bold mt-1">{roleCounts.USER || 0}</h3>
            </div>
            <div className="bg-green-400/10 p-3 rounded-full">
              <Mail className="h-6 w-6 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800 border-gray-700 text-white overflow-hidden">
        <CardHeader className="bg-gray-900 py-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-blue-400">
              Список пользователей
              {selectedRole !== "all" && (
                <Badge className="ml-2 bg-blue-500">
                  {selectedRole === "ADMIN" ? "Администраторы" : "Пользователи"}
                </Badge>
              )}
            </CardTitle>
            <Button
              size="sm"
              onClick={() => setSelectedRole("all")}
              className={selectedRole === "all" ? "hidden" : ""}
            >
              Сбросить фильтр
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-gray-800 border-gray-700">
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Пользователь</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Роль</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentUsers.map((user, index) => (
                  <TableRow key={user.id} className="hover:bg-gray-700/50 border-gray-700">
                    <TableCell className="font-medium">{indexOfFirstUser + index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar || ""} alt={user.firstName} />
                          <AvatarFallback className="bg-blue-500/20 text-blue-400">
                            {user.firstName?.[0]}
                            {user.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-xs text-gray-400">ID: {user.id.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.role === "ADMIN" ? (
                        <Badge className="bg-purple-500">Администратор</Badge>
                      ) : (
                        <Badge className="bg-green-500">Пользователь</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.role != "UNVERIFIED" ? (
                        <Badge variant="outline" className="bg-green-400/10 text-green-400 border-green-400/20">
                          Подтвержден
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-yellow-400/10 text-yellow-400 border-yellow-400/20">
                          Не подтвержден
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm">
                              Действия
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-white">
                            <DropdownMenuLabel>Управление пользователем</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-gray-700" />
                            <DialogTrigger asChild>
                              <DropdownMenuItem>Просмотр профиля</DropdownMenuItem>
                            </DialogTrigger>
                            <DropdownMenuItem>
                              {user.role === "ADMIN" ? "Снять права админа" : "Сделать админом"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-gray-700" />
                            <DropdownMenuItem className="text-red-400">Заблокировать</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>

                        <DialogContent className="bg-gray-800 border-gray-700 text-white">
                          <DialogHeader>
                            <DialogTitle className="text-xl text-blue-400">Профиль пользователя</DialogTitle>
                            <DialogDescription className="text-gray-400">
                              Детальная информация о пользователе
                            </DialogDescription>
                          </DialogHeader>

                          <div className="mt-4 flex flex-col items-center">
                            <Avatar className="h-24 w-24 mb-4">
                              <AvatarImage src={user.avatar || ""} alt={user.firstName} />
                              <AvatarFallback className="bg-blue-500/20 text-blue-400 text-2xl">
                                {user.firstName?.[0]}
                                {user.lastName?.[0]}
                              </AvatarFallback>
                            </Avatar>

                            <h2 className="text-xl font-bold">
                              {user.firstName} {user.lastName}
                            </h2>
                            <p className="text-gray-400">{user.email}</p>

                            <div className="flex gap-2 mt-2">
                              <Badge className={user.role === "ADMIN" ? "bg-purple-500" : "bg-green-500"}>
                                {user.role === "ADMIN" ? "Администратор" : "Пользователь"}
                              </Badge>
                              {user.role !== "UNVERIFIED" ? (
                                <Badge variant="outline" className="bg-green-400/10 text-green-400 border-green-400/20">
                                  Подтвержден
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="bg-yellow-400/10 text-yellow-400 border-yellow-400/20"
                                >
                                  Не подтвержден
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mt-6">
                            <div>
                              <p className="text-sm text-gray-400">ID пользователя</p>
                              <p className="text-sm font-mono bg-gray-900 p-2 rounded mt-1 overflow-x-auto">
                                {user.id}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Дата регистрации</p>
                              <p className="font-medium">{new Date(user.createdAt).toLocaleString("ru-RU")}</p>
                            </div>
                          </div>

                          <div className="flex justify-between mt-6">
                            <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/10">
                              Заблокировать
                            </Button>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                              {user.role === "ADMIN" ? "Снять права админа" : "Сделать админом"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center p-4 border-t border-gray-700">
              <div className="text-sm text-gray-400">
                Показано {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} из{" "}
                {filteredUsers.length} пользователей
              </div>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: totalPages }).map((_, index) => (
                  <Button
                    key={index}
                    size="sm"
                    onClick={() => setCurrentPage(index + 1)}
                    className="h-8 w-8 p-0"
                  >
                    {index + 1}
                  </Button>
                ))}
                <Button
                  size="icon"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

