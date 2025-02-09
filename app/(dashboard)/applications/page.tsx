"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import {
  Applications,
  getPosts,
  getUsers,
  updatePostStatusById,
} from "../../actions";
import { ButtonApprove } from "@/components/shared/buttonApprove";
import { getUserSession } from "@/lib/get-session-server";
import { Card, CardContent } from "@/components/ui/card";
import { PendingPostCard } from "@/components/shared/PendingPostCard";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [pendingPosts, setPendingPosts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const sessionUser = await getUserSession();
      if (sessionUser?.role !== "ADMIN") {
        // Handle non-admin access (e.g., redirect)
        return;
      }
      setUser(sessionUser);

      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);

      const fetchedApplications = await Applications();
      setApplications(fetchedApplications);

      const allPosts = await getPosts();
      const filteredPendingPosts = allPosts.filter(
        (post) => post.postStatus !== "APPROVED"
      );
      setPendingPosts(filteredPendingPosts);
    }

    fetchData();
  }, []);

  async function handleApprove(postId: string) {
    await updatePostStatusById(postId, true);
    // Update the local state to reflect the change
    setPendingPosts((prevPosts) =>
      prevPosts.filter((post) => post.id !== postId)
    );
  }

  async function handleReject(postId: string) {
    await updatePostStatusById(postId, false);
    // Update the local state to reflect the change
    setPendingPosts((prevPosts) =>
      prevPosts.filter((post) => post.id !== postId)
    );
  }

  if (!user) return null; // Or a loading state

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6">
      <div className="max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Applications Section */}
          <section>
            <h1 className="text-3xl font-bold text-green-400 mb-8">
              Заявки на регистрацию
            </h1>
            <div className="grid gap-4">
              {applications.map((a) => (
                <Card
                  key={a.id}
                  className="bg-gray-800 border-gray-700 text-white"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex flex-col sm:flex-row gap-6 flex-1">
                        <div>
                          <div className="text-sm text-gray-400">Имя</div>
                          <div className="text-green-400 font-medium">
                            {a.firstName + " " + a.lastName}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">Email</div>
                          <div className="text-gray-300">{a.email}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">
                            Дата обновления
                          </div>
                          <div className="text-gray-300">
                            {new Date(a.updatedAt).toLocaleString("ru-RU")}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <ButtonApprove
                          a={a}
                          isDelete={false}
                          icon={<Check className="w-5 h-5 text-green-400" />}
                        />
                        <ButtonApprove
                          a={a}
                          isDelete={true}
                          icon={<X className="w-5 h-5 text-red-400" />}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Post Applications Section */}
          <section>
            <h2 className="text-3xl font-bold text-yellow-400 mb-8">
              Заявки на публикацию
            </h2>
            <div className="grid gap-4">
              {pendingPosts.map((post) => (
                <PendingPostCard
                  key={post.id}
                  post={post}
                  author={users.find((user) => user.id === post.authorId)}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
