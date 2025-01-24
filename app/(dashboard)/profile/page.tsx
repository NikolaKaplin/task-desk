import ProfileForm from "@/components/shared/forms/profile/profile-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserSession } from "@/lib/get-session-server"


export default async function ProfilePage() {
  let user = (await getUserSession())?.id
  return (
    <div className="  bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>View and update your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm user={user} />
        </CardContent>
      </Card>
    </div>
  )
}