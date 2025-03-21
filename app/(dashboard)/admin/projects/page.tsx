"use client";

import { useEffect, useState } from "react";
import {
  Search,
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  FolderKanban,
  Clock,
  Eye,
  ListTodo,
  Trash2,
} from "lucide-react";
import {
  getProjects,
  getTasksByProjectId,
  getUsers,
  deleteProject,
  deleteTask,
} from "../../../actions";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const updateProjectStatus = async (projectId, status) => {
  console.log(`Updating project ${projectId} status to ${status}`);
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { success: true };
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectTasks, setProjectTasks] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleteProjectDialogOpen, setDeleteProjectDialogOpen] = useState(false);
  const [deleteTaskDialogOpen, setDeleteTaskDialogOpen] = useState(false);

  const projectsPerPage = 6;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [fetchedProjects, fetchedUsers] = await Promise.all([
          getProjects(),
          getUsers(),
        ]);
        setProjects(fetchedProjects);
        setFilteredProjects(fetchedProjects);
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...projects];
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.name?.toLowerCase().includes(query) ||
          project.content?.toLowerCase().includes(query)
      );
    }

    setFilteredProjects(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchQuery, projects, activeTab]);

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  const handleApprove = async (projectId) => {
    try {
      await updateProjectStatus(projectId, "APPROVED");
      setProjects(
        projects.map((project) =>
          project.id === projectId
            ? { ...project, projectStatus: "APPROVED" }
            : project
        )
      );

      if (selectedProject && selectedProject.id === projectId) {
        setSelectedProject({ ...selectedProject, projectStatus: "APPROVED" });
      }
    } catch (error) {
      console.error("Error approving project:", error);
    }
  };

  const handleReject = async (projectId) => {
    try {
      await updateProjectStatus(projectId, "REJECTED");
      setProjects(
        projects.map((project) =>
          project.id === projectId
            ? { ...project, projectStatus: "REJECTED" }
            : project
        )
      );
      if (selectedProject && selectedProject.id === projectId) {
        setSelectedProject({ ...selectedProject, projectStatus: "REJECTED" });
      }
    } catch (error) {
      console.error("Error rejecting project:", error);
    }
  };

  const openProjectDetails = async (project) => {
    setSelectedProject(project);
    setDialogOpen(true);
    setLoadingTasks(true);
    try {
      const tasks = await getTasksByProjectId(project.id);
      setProjectTasks(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setProjectTasks([]);
    } finally {
      setLoadingTasks(false);
    }
  };

  const getAuthor = (authorId) => {
    return (
      users.find((user) => user.id === authorId) || {
        firstName: "Неизвестно",
        lastName: "",
        email: "",
        avatar: "",
      }
    );
  };

  const calculateProgress = (projectId) => {
    if (projectTasks.length === 0) return 0;

    const completedTasks = projectTasks.filter(
      (task) => task.status === "COMPLETED" || task.status === "DONE"
    ).length;

    return Math.round((completedTasks / projectTasks.length) * 100);
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await deleteProject(projectId);
      setProjects(projects.filter((project) => project.id !== projectId));
      setFilteredProjects(
        filteredProjects.filter((project) => project.id !== projectId)
      );
      if (selectedProject && selectedProject.id === projectId) {
        setDialogOpen(false);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };
  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setProjectTasks(projectTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1800px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-purple-400 mb-2">
            Модерация проектов
          </h1>
          <p className="text-gray-400 text-sm">
            Просмотр и управление проектами пользователей
          </p>
        </div>
        <div className="relative w-full sm:w-64 md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Поиск по названию..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">
                Всего проектов
              </p>
              <h3 className="text-2xl font-bold mt-1">{projects.length}</h3>
            </div>
            <div className="bg-purple-400/10 p-3 rounded-full">
              <FolderKanban className="h-6 w-6 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">
                Активных проектов
              </p>
              <h3 className="text-2xl font-bold mt-1">
                {projects.filter((p) => p.projectStatus !== "COMPLETED").length}
              </h3>
            </div>
            <div className="bg-yellow-400/10 p-3 rounded-full">
              <Clock className="h-6 w-6 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {filteredProjects.length === 0 ? (
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardContent className="p-8 text-center">
            <p className="text-gray-400">Нет проектов для отображения</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                author={getAuthor(project.authorId)}
                onApprove={handleApprove}
                onReject={handleReject}
                onViewDetails={openProjectDetails}
                setProjectToDelete={setProjectToDelete}
                setDeleteProjectDialogOpen={setDeleteProjectDialogOpen}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-8">
              <div className="text-sm text-gray-400">
                Показано {indexOfFirstProject + 1}-
                {Math.min(indexOfLastProject, filteredProjects.length)} из{" "}
                {filteredProjects.length} проектов
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
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
                    variant={currentPage === index + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(index + 1)}
                    className="h-8 w-8 p-0"
                  >
                    {index + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
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
        </>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-auto">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl text-purple-400">
                  {selectedProject.name}
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  Детальная информация о проекте
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={getAuthor(selectedProject.authorId).avatar || ""}
                        alt={getAuthor(selectedProject.authorId).firstName}
                      />
                      <AvatarFallback className="bg-purple-500/20 text-purple-400">
                        {getAuthor(selectedProject.authorId).firstName?.[0]}
                        {getAuthor(selectedProject.authorId).lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm text-gray-400">Автор проекта</div>
                      <div className="font-medium">
                        {getAuthor(selectedProject.authorId).firstName}{" "}
                        {getAuthor(selectedProject.authorId).lastName}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedProject.projectStatus && (
                      <Badge
                        className={
                          selectedProject.projectStatus === "APPROVED"
                            ? "bg-green-500"
                            : selectedProject.projectStatus === "REJECTED"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        }
                      >
                        {selectedProject.projectStatus === "APPROVED"
                          ? "Одобрен"
                          : selectedProject.projectStatus === "REJECTED"
                          ? "Отклонен"
                          : "В работе"}
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className="bg-purple-400/10 text-purple-400 border-purple-400/20"
                    >
                      Создан:{" "}
                      {new Date(selectedProject.createdAt).toLocaleDateString(
                        "ru-RU"
                      )}
                    </Badge>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Описание проекта</h3>
                  <p className="text-gray-300 whitespace-pre-wrap">
                    {selectedProject.content}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <ListTodo className="mr-2 h-5 w-5" />
                    Задачи проекта
                  </h3>

                  {loadingTasks ? (
                    <div className="flex justify-center py-8">
                      <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : projectTasks.length === 0 ? (
                    <div className="bg-gray-900 rounded-md p-6 text-center">
                      <p className="text-gray-400">
                        У этого проекта пока нет задач
                      </p>
                    </div>
                  ) : (
                    <div className="bg-gray-900 rounded-md overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                              Задача
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                              Статус
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                              Приоритет
                            </th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">
                              Действия
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {projectTasks.map((task) => (
                            <tr
                              key={task.id}
                              className="border-b border-gray-700 last:border-0"
                            >
                              <td className="px-4 py-3 text-sm">
                                {task.title}
                              </td>
                              <td className="px-4 py-3">
                                {task.status === "COMPLETED" ||
                                task.status === "DONE" ? (
                                  <Badge className="bg-green-500">
                                    Выполнено
                                  </Badge>
                                ) : task.status === "IN_PROGRESS" ? (
                                  <Badge className="bg-blue-500">
                                    В процессе
                                  </Badge>
                                ) : (
                                  <Badge className="bg-yellow-500">
                                    Ожидает
                                  </Badge>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {task.priority === "HIGH" ? (
                                  <Badge
                                    variant="outline"
                                    className="bg-red-400/10 text-red-400 border-red-400/20"
                                  >
                                    Высокий
                                  </Badge>
                                ) : task.priority === "MEDIUM" ? (
                                  <Badge
                                    variant="outline"
                                    className="bg-yellow-400/10 text-yellow-400 border-yellow-400/20"
                                  >
                                    Средний
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className="bg-blue-400/10 text-blue-400 border-blue-400/20"
                                  >
                                    Низкий
                                  </Badge>
                                )}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                  onClick={() => {
                                    setTaskToDelete(task);
                                    setDeleteTaskDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">
                                    Удалить задачу
                                  </span>
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">
                    Прогресс выполнения
                  </h3>
                  <Progress
                    value={calculateProgress(selectedProject.id)}
                    className="h-2"
                  />
                  <div className="flex justify-between mt-1 text-xs text-gray-400">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <Button
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-500/10"
                    onClick={() => {
                      handleReject(selectedProject.id);
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Отклонить
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      handleApprove(selectedProject.id);
                    }}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Одобрить
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Диалог подтверждения удаления проекта */}
      <AlertDialog
        open={deleteProjectDialogOpen}
        onOpenChange={setDeleteProjectDialogOpen}
      >
        <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Удаление проекта</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              {projectToDelete && (
                <>
                  Вы собираетесь удалить проект{" "}
                  <span className="font-medium text-white">
                    {projectToDelete.name}
                  </span>
                  . Это действие нельзя отменить, и все данные проекта, включая
                  задачи, будут безвозвратно удалены.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">
              Отмена
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (projectToDelete) {
                  handleDeleteProject(projectToDelete.id);
                }
                setDeleteProjectDialogOpen(false);
              }}
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Диалог подтверждения удаления задачи */}
      <AlertDialog
        open={deleteTaskDialogOpen}
        onOpenChange={setDeleteTaskDialogOpen}
      >
        <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Удаление задачи</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              {taskToDelete && (
                <>
                  Вы собираетесь удалить задачу{" "}
                  <span className="font-medium text-white">
                    {taskToDelete.title}
                  </span>
                  . Это действие нельзя отменить.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">
              Отмена
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (taskToDelete) {
                  handleDeleteTask(taskToDelete.id);
                }
                setDeleteTaskDialogOpen(false);
              }}
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ProjectCard({
  project,
  author,
  onApprove,
  onReject,
  onViewDetails,
  setProjectToDelete,
  setDeleteProjectDialogOpen,
}) {
  const formattedDate = new Date(project.createdAt).toLocaleDateString("ru-RU");
  const daysSinceCreation = Math.floor(
    (new Date() - new Date(project.createdAt)) / (1000 * 60 * 60 * 24)
  );
  const projectUsers = JSON.parse(project.content)
              .users.map((userId: number) => users.find((u) => u.id === userId))
              .filter(Boolean);

  return (
    <Card className="bg-gray-800 border-gray-700 text-white h-full flex flex-col">
      <CardContent className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-4 mb-4">
          <h3 className="text-xl font-bold text-purple-400 line-clamp-2">
            {project.name}
          </h3>
          {project.projectStatus && (
            <Badge
              className={
                project.projectStatus === "APPROVED"
                  ? "bg-green-500"
                  : project.projectStatus === "REJECTED"
                  ? "bg-red-500"
                  : "bg-yellow-500"
              }
            >
              {project.projectStatus === "APPROVED"
                ? "Одобрен"
                : project.projectStatus === "REJECTED"
                ? "Отклонен"
                : "В работе"}
            </Badge>
          )}
        </div>

        <div className="mb-4 flex-1">
          <p className="text-gray-300 line-clamp-3">{JSON.parse(project.content)
            }</p>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={author.avatar || ""} alt={author.firstName} />
            <AvatarFallback className="bg-purple-500/20 text-purple-400">
              {author.firstName?.[0]}
              {author.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-medium">
              {author.firstName} {author.lastName}
            </div>
            <div className="text-xs text-gray-400">{formattedDate}</div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => onViewDetails(project)}
          >
            <Eye className="h-4 w-4" />
            Детали
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-red-500 text-red-500 hover:bg-red-500/10"
              onClick={() => {
                setProjectToDelete(project);
                setDeleteProjectDialogOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-red-500 text-red-500 hover:bg-red-500/10"
              onClick={() => onReject(project.id)}
            >
              <X className="h-4 w-4 mr-2" />
              Отклонить
            </Button>
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => onApprove(project.id)}
            >
              <Check className="h-4 w-4 mr-2" />
              Одобрить
            </Button>
          </div>
        </div>

        {daysSinceCreation > 2 && (
          <Badge
            variant="outline"
            className="mt-4 self-start bg-red-400/10 text-red-400 border-red-400/20"
          >
            Создан {daysSinceCreation} дн. назад
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
