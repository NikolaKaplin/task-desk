"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { InputImage } from './input-image'
import { getUserSession } from '@/lib/get-session-server'

interface AvatarUploadProps {
  currentAvatarUrl: string
}

export default function AvatarUpload({ currentAvatarUrl }: AvatarUploadProps) {
  const [user, setUser] = useState();
  const [avatar, setAvatar] = useState();
  const [isLoading, setIsLoading] = React.useState(true);
  const [questionImage, setQuestionImage] = useState("");

  React.useEffect(() => {
    (async () => {
      const u = await getUserSession();
      setUser(u);
      setAvatar(u?.avatar);
      console.log(avatar)
      setIsLoading(false)
    })();
  }, []);
  return (
    <div className="flex flex-col items-center space-y-4">
      <img
        src={isLoading ? "https://cdn-user30887.skyeng.ru/uploads/6769b4e6502ea676889877.webp" : avatar}
        alt="User Avatar"
        width={100}
        height={100}
        className="rounded-full"
      />
      <div>
        {user ? <InputImage userId={user.id} onChange={setQuestionImage}/> : <>Загрузка</> }
      </div>
    </div>
  )
}

