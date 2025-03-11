"use client";

import { useEffect, useState } from "react";
import { Check, X, Search, ArrowLeft, ArrowRight } from "lucide-react";
import { Applications } from "../../../actions";
import { ButtonApprove } from "@/components/shared/buttonApprove";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const applicationsPerPage = 10;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const fetchedApplications = await Applications();
      setApplications(fetchedApplications);
      setFilteredApplications(fetchedApplications);
      setLoading(false);
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredApplications(applications);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = applications.filter(
        (app) =>
          app.firstName.toLowerCase().includes(query) ||
          app.lastName.toLowerCase().includes(query) ||
          app.email.toLowerCase().includes(query)
      );
      setFilteredApplications(filtered);
      setCurrentPage(1); // Reset to first page on new search
    }
  }, [searchQuery, applications]);

  // Pagination logic
  const indexOfLastApplication = currentPage * applicationsPerPage;
  const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;
  const currentApplications = filteredApplications.slice(
    indexOfFirstApplication,
    indexOfLastApplication
  );
  const totalPages = Math.ceil(
    filteredApplications.length / applicationsPerPage
  );

  // Handle application removal from list after action
  const handleApplicationAction = (applicationId) => {
    setApplications(applications.filter((app) => app.id !== applicationId));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1800px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-green-400">
          Заявки на регистрацию
        </h1>
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

      {filteredApplications.length === 0 ? (
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardContent className="p-8 text-center">
            <p className="text-gray-400">Нет заявок на рассмотрение</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4">
            {currentApplications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onAction={handleApplicationAction}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-8">
              <div className="text-sm text-gray-400">
                Показано {indexOfFirstApplication + 1}-
                {Math.min(indexOfLastApplication, filteredApplications.length)}{" "}
                из {filteredApplications.length} заявок
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
    </div>
  );
}

function ApplicationCard({ application, onAction }) {
  const formattedDate = new Date(application.updatedAt).toLocaleString("ru-RU");
  const daysSinceCreation = Math.floor(
    (new Date() - new Date(application.createdAt)) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card className="bg-gray-800 border-gray-700 text-white overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
              <div>
                <div className="text-sm text-gray-400">Имя</div>
                <div className="text-green-400 font-medium">
                  {application.firstName} {application.lastName}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Email</div>
                <div className="text-gray-300">{application.email}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Дата обновления</div>
                <div className="text-gray-300">{formattedDate}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {daysSinceCreation > 3 && (
                <Badge
                  variant="outline"
                  className="bg-red-400/10 text-red-400 border-red-400/20"
                >
                  Ожидает {daysSinceCreation} дн.
                </Badge>
              )}
              <ButtonApprove
                a={application}
                isDelete={false}
                icon={<Check className="w-5 h-5 text-green-400" />}
                onSuccess={() => onAction(application.id)}
              />
              <ButtonApprove
                a={application}
                isDelete={true}
                icon={<X className="w-5 h-5 text-red-400" />}
                onSuccess={() => onAction(application.id)}
              />
            </div>
          </div>
        </div>

        {application.message && (
          <div className="px-6 py-4 bg-gray-900 border-t border-gray-700">
            <div className="text-sm text-gray-400 mb-1">
              Сообщение от пользователя:
            </div>
            <div className="text-gray-300">{application.message}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
