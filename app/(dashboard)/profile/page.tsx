import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserSession } from "@/lib/get-session-server";
import ProfileForm from "@/components/shared/forms/profile/profile-form";
import ContactsBlock from "@/components/shared/forms/profile/contacts-blocks";
import TaskStatisticsGraph from "@/components/shared/forms/profile/task-statistics-graph";

export default async function ProfilePage() {
  const user = await getUserSession();

  return (
    <div className="min-h-screen bg-transparent text-white p-4 sm:p-6 md:p-8">
      <Card className="max-w-6xl mx-auto bg-gray-800 border-gray-700 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-green-400">
            Profile
          </CardTitle>
          <CardDescription className="text-gray-400">
            View and update your profile information
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <ProfileForm user={user} />
            </div>
            <div className="space-y-6">
              <ContactsBlock user={user} />
              <TaskStatisticsGraph userId={user.id} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
