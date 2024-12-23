"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button" //Removed as per update 2

export default function AvatarUpload({
  user,
}: {
  user: { id: string; name: string; avatarUrl: string };
}) {
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("avatar", file);
      formData.append("userId", user.id);

      const result = await updateAvatar(formData);
      if (result.success) {
        setAvatarUrl(result.avatarUrl);
      }
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar
        className="w-32 h-32 cursor-pointer"
        onClick={() => document.getElementById("avatar-upload")?.click()}
      >
        <AvatarImage src={avatarUrl} alt={user.name} />
        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <input
        id="avatar-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
