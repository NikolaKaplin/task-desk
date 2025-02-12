"use client";
import React, { useState } from "react";
import { InputImage } from "./input-image";
import { getUserSession } from "@/lib/get-session-server";
import { LoaderCircle } from "lucide-react";

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
      setAvatar(u?.avatarUrl);
      console.log(avatar);
      setIsLoading(false);
    })();
  }, [avatar]);

  const handlerImage = (url: string) => {
    setQuestionImage(url);
    setAvatar(url);
  };
  return (
    <div
      className="relative flex flex-col items-center space-y-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {isLoading ? (
          <div className="flex items-center justify-center h-[150px] w-[150px]">
            <LoaderCircle className="animate-spin text-indigo-400 " />
          </div>
        ) : (
          <img
            src={avatar}
            alt="User Avatar"
            width={150}
            height={150}
            className="rounded-full"
          />
        )}
        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full transition-opacity duration-300">
            {user && (
              <div className="z-10">
                <InputImage userId={user.id} onChange={handlerImage} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
