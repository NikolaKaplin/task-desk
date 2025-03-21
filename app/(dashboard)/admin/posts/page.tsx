"use client";

import { useEffect, useState } from "react";
import {
  Check,
  X,
  Search,
  ArrowLeft,
  ArrowRight,
  Eye,
  Trash2,
} from "lucide-react";
import {
  getPosts,
  getUsers,
  updatePostStatusById,
  deletePost,
} from "../../../actions";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Добавим компоненты для диалога подтверждения
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

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("pending");
  const postsPerPage = 8;

  // В компоненте PostsPage добавим состояние для диалога подтверждения удаления
  const [postToDelete, setPostToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [fetchedPosts, fetchedUsers] = await Promise.all([
        getPosts(),
        getUsers(),
      ]);

      setPosts(fetchedPosts);
      setUsers(fetchedUsers);
      setLoading(false);
    }

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...posts];

    // Filter by status
    if (activeTab === "pending") {
      filtered = filtered.filter(
        (post) =>
          post.postStatus !== "APPROVED" && post.postStatus !== "REJECTED"
      );
    } else if (activeTab === "approved") {
      filtered = filtered.filter((post) => post.postStatus === "APPROVED");
    } else if (activeTab === "rejected") {
      filtered = filtered.filter((post) => post.postStatus === "REJECTED");
    }

    // Apply search
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          users
            .find((u) => u.id === post.authorId)
            ?.firstName.toLowerCase()
            .includes(query) ||
          users
            .find((u) => u.id === post.authorId)
            ?.lastName.toLowerCase()
            .includes(query)
      );
    }

    setFilteredPosts(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchQuery, posts, activeTab, users]);

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  async function handleApprove(postId) {
    await updatePostStatusById(postId, true);
    // Update the local state to reflect the change
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, postStatus: "APPROVED" } : post
      )
    );
  }

  async function handleReject(postId) {
    await updatePostStatusById(postId, false);
    // Update the local state to reflect the change
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, postStatus: "REJECTED" } : post
      )
    );
  }

  // Добавим функцию для обработки удаления поста
  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      // Обновляем список постов после удаления
      setPosts(posts.filter((post) => post.id !== postId));

      // Закрываем диалог просмотра, если удаляемый пост был открыт
      document
        .querySelector('[role="dialog"]')
        ?.closest('div[data-state="open"]')
        ?.querySelector('button[data-state="closed"]')
        ?.click();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1800px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">
            Модерация постов
          </h1>
          <p className="text-gray-400 text-sm">
            Просмотр и управление постами пользователей, требующими модерации
          </p>
        </div>
        <div className="relative w-full sm:w-64 md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Поиск по заголовку или автору..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white"
          />
        </div>
      </div>

      <Tabs
        defaultValue="pending"
        className="mb-6"
        onValueChange={setActiveTab}
      >
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger
            value="pending"
            className="data-[state=active]:bg-gray-700"
          >
            Ожидают модерации
            {posts.filter(
              (p) => p.postStatus !== "APPROVED" && p.postStatus !== "REJECTED"
            ).length > 0 && (
              <Badge className="ml-2 bg-yellow-500">
                {
                  posts.filter(
                    (p) =>
                      p.postStatus !== "APPROVED" && p.postStatus !== "REJECTED"
                  ).length
                }
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="approved"
            className="data-[state=active]:bg-gray-700"
          >
            Одобренные
          </TabsTrigger>
          <TabsTrigger
            value="rejected"
            className="data-[state=active]:bg-gray-700"
          >
            Отклоненные
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredPosts.length === 0 ? (
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardContent className="p-8 text-center">
            <p className="text-gray-400">
              {activeTab === "pending"
                ? "Нет постов, ожидающих модерации"
                : activeTab === "approved"
                ? "Нет одобренных постов"
                : "Нет отклоненных постов"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                author={users.find((user) => user.id === post.authorId)}
                onApprove={handleApprove}
                onReject={handleReject}
                showActions={activeTab === "pending"}
                setPostToDelete={setPostToDelete}
                setDeleteDialogOpen={setDeleteDialogOpen}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-8">
              <div className="text-sm text-gray-400">
                Показано {indexOfFirstPost + 1}-
                {Math.min(indexOfLastPost, filteredPosts.length)} из{" "}
                {filteredPosts.length} постов
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
      {/* Диалог подтверждения удаления */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Удаление поста</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              {postToDelete && (
                <>
                  Вы собираетесь удалить пост{" "}
                  <span className="font-medium text-white">
                    {postToDelete.title}
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
                if (postToDelete) {
                  handleDeletePost(postToDelete.id);
                }
                setDeleteDialogOpen(false);
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

function PostCard({
  post,
  author,
  onApprove,
  onReject,
  showActions,
  setPostToDelete,
  setDeleteDialogOpen,
}) {
  const formattedDate = new Date(post.createdAt).toLocaleString("ru-RU");
  const daysSinceCreation = Math.floor(
    (new Date() - new Date(post.createdAt)) / (1000 * 60 * 60 * 24)
  );

  const statusBadge = {
    APPROVED: <Badge className="bg-green-500">Одобрен</Badge>,
    REJECTED: <Badge className="bg-red-500">Отклонен</Badge>,
    PENDING: <Badge className="bg-yellow-500">На модерации</Badge>,
  };

  return (
    <Card className="bg-gray-800 border-gray-700 text-white h-full flex flex-col">
      <CardContent className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-4 mb-4">
          <h3 className="text-xl font-bold text-yellow-400 line-clamp-2">
            {post.title}
          </h3>
          {post.postStatus && statusBadge[post.postStatus]}
        </div>

        <div className="mb-4 flex-1">
          <p className="text-gray-300 line-clamp-3">{post.content}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <div className="text-gray-400">Автор</div>
            <div className="text-white">
              {author ? `${author.firstName} ${author.lastName}` : "Неизвестно"}
            </div>
          </div>
          <div>
            <div className="text-gray-400">Дата создания</div>
            <div className="text-white">{formattedDate}</div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Eye className="h-4 w-4" />
                Просмотр
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-3xl max-h-[80vh] overflow-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl text-yellow-400">
                  {post.title}
                </DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
                  <div>
                    Автор:{" "}
                    {author
                      ? `${author.firstName} ${author.lastName}`
                      : "Неизвестно"}
                  </div>
                  <div>•</div>
                  <div>{formattedDate}</div>
                </div>
                <div className="prose prose-invert max-w-none">
                  <p className="whitespace-pre-wrap">{post.content}</p>
                </div>
                {post.imageUrl && (
                  <div className="mt-4">
                    <img
                      src={post.imageUrl || "/placeholder.svg"}
                      alt={post.title}
                      className="max-w-full rounded-md"
                    />
                  </div>
                )}
              </div>
              {showActions && (
                <div className="flex justify-end gap-3 mt-6">
                  <Button
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-500/10"
                    onClick={() => {
                      onReject(post.id);
                      document
                        .querySelector('[role="dialog"]')
                        ?.closest('div[data-state="open"]')
                        ?.querySelector('button[data-state="closed"]')
                        ?.click();
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Отклонить
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      onApprove(post.id);
                      document
                        .querySelector('[role="dialog"]')
                        ?.closest('div[data-state="open"]')
                        ?.querySelector('button[data-state="closed"]')
                        ?.click();
                    }}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Одобрить
                  </Button>
                </div>
              )}
              <Button
                variant="outline"
                className="absolute top-4 right-16 border-red-500 text-red-500 hover:bg-red-500/10"
                onClick={() => {
                  setPostToDelete(post);
                  setDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Удалить
              </Button>
            </DialogContent>
          </Dialog>

          {showActions && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-red-500 text-red-500 hover:bg-red-500/10"
                onClick={() => {
                  setPostToDelete(post);
                  setDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-red-500 text-red-500 hover:bg-red-500/10"
                onClick={() => onReject(post.id)}
              >
                <X className="h-4 w-4 mr-2" />
                Отклонить
              </Button>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => onApprove(post.id)}
              >
                <Check className="h-4 w-4 mr-2" />
                Одобрить
              </Button>
            </div>
          )}
        </div>

        {daysSinceCreation > 2 &&
          post.postStatus !== "APPROVED" &&
          post.postStatus !== "REJECTED" && (
            <Badge
              variant="outline"
              className="mt-4 self-start bg-red-400/10 text-red-400 border-red-400/20"
            >
              Ожидает {daysSinceCreation} дн.
            </Badge>
          )}
      </CardContent>
    </Card>
  );
}
