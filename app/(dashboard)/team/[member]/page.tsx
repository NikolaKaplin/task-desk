import ContactInfo from "@/components/shared/public-profile/ContactInfo";
import TaskCompletion from "@/components/shared/public-profile/TaskCompletion";
import UserInfo from "@/components/shared/public-profile/UserInfo";

export interface User {
  avatar: string;
  firstName: string;
  lastName: string;
  middleName: string;
  devStatus: string;
  description: string;
  contacts: {
    phone: string;
    email: string;
    github: string;
    gitlab: string;
    telegram: string;
  };
}

export const mockUser: User = {
  avatar: "/placeholder.svg?height=200&width=200",
  firstName: "Иван",
  lastName: "Иванов",
  middleName: "Иванович",
  devStatus: "Senior Frontend Developer",
  description:
    "Опытный разработчик с более чем 10-летним стажем в области веб-разработки. Специализируюсь на создании высокопроизводительных и масштабируемых приложений.",
  contacts: {
    phone: "+7 (999) 123-45-67",
    email: "ivan.ivanov@example.com",
    github: "https://github.com/ivanivanov",
    gitlab: "https://gitlab.com/ivanivanov",
    telegram: "https://t.me/ivanivanov",
  },
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden border border-gray-700">
          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/3 bg-gradient-to-b from-gray-800 to-gray-900 p-8 border-r border-gray-700">
              <UserInfo />
            </div>
            <div className="w-full lg:w-2/3 p-8 space-y-8">
              <ContactInfo contacts={mockUser.contacts} />
              <TaskCompletion />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
