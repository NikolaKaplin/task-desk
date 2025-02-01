import ProfileForm from "@/components/shared/forms/profile/profile-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserSession } from "@/lib/get-session-server"

export default async function ProfilePage() {
  const user = (await getUserSession())
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4 sm:p-6 md:p-8">
      <Card className="max-w-2xl mx-auto bg-gray-800 border-gray-700 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-green-400">Profile</CardTitle>
          <CardDescription className="text-gray-400">View and update your profile information</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <ProfileForm user={user} />
        </CardContent>
      </Card>
    </div>
  )
}

