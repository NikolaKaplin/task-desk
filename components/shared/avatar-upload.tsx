"use client";
import React, { useState } from "react";
import { InputImage } from "./input-image";
import { getUserSession } from "@/lib/get-session-server";

interface AvatarUploadProps {
  currentAvatarUrl: string;
}

export default function AvatarUpload({ currentAvatarUrl }: AvatarUploadProps) {
  const [user, setUser] = useState();
  const [avatar, setAvatar] = useState();
  const [isLoading, setIsLoading] = React.useState(true);
  const [questionImage, setQuestionImage] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  React.useEffect(() => {
    (async () => {
      const u = await getUserSession();
      setUser(u);
      setAvatar(u?.avatar);
      console.log(avatar);
      setIsLoading(false);
    })();
  }, [avatar]); // Added avatar to the dependency array

  return (
    <div
      className="relative flex flex-col items-center space-y-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <img
          src={
            isLoading
              ? "https://cdn-user30887.skyeng.ru/uploads/6769b4e6502ea676889877.webp"
              : avatar
          }
          alt="User Avatar"
          width={150}
          height={150}
          className="rounded-full"
        />
        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full transition-opacity duration-300">
            {user && (
              <div className="z-10">
                <InputImage userId={user.id} onChange={setQuestionImage} />
              </div>
            )}
          </div>
        )}
      </div>
      {isLoading && <div>Загрузка</div>}
    </div>
  );
}
