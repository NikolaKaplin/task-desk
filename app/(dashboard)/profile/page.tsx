import AvatarUpload from "@/components/shared/avatar-upload";
import { ProfileForm } from "@/components/shared/forms/profile/form-profile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  description: "User profile page",
};

async function getUser() {
  // This would typically fetch the user from your database
  return {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    bio: "I'm a software developer",
    avatarUrl: "/placeholder.svg?height=128&width=128",
  };
}

export default async function ProfilePage() {
  const user = await getUser();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>
      <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
        <div>
          <AvatarUpload user={user} />
        </div>
        <div>
          <ProfileForm user={user} />
        </div>
      </div>
    </div>
  );
}
