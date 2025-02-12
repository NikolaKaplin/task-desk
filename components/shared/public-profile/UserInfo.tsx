"use client";
import { getUserInfo } from "@/app/actions";
import { getUserSession } from "@/lib/get-session-server";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { any } from "zod";
import ContactInfo from "./ContactInfo";

export default function UserInfo({ contacts }: any) {
  let userPath = usePathname().split("-");
  const decodeAndProcessArray = (arr) => {
    return arr.map((item, index) => {
      const decoded = decodeURIComponent(item);
      if (index === 0) {
        return decoded.substring(decoded.lastIndexOf("/") + 1);
      }
      return decoded;
    });
  };
  let arrInfo = decodeAndProcessArray(userPath);
  console.log(arrInfo);
  const [user, setUser] = useState(any);
  const [isLoading, setIsLoading] = useState(true);
  React.useEffect(() => {
    const fetchUserInfo = async () => {
      const userInfo = await getUserInfo(arrInfo[0], arrInfo[1]);
      console.log(userInfo);
      if (userInfo) {
        setUser(userInfo);
      }
      setIsLoading(false);
    };
    fetchUserInfo();
  }, []);

  return (
    <div className="flex flex-col items-center text-gray-300">
      {isLoading ? (
        <div>
          <LoaderCircle className=" animate-spin" />
        </div>
      ) : (
        <>
          <div className="relative w-48 h-48 mb-6">
            <img
              src={
                user.avatarUrl ||
                "https://avatars.githubusercontent.com/u/160280854?v=4"
              }
              alt={`${user.firstName} ${user.lastName}`}
              layout="fill"
              objectFit="cover"
              className="rounded-full border-4 border-gray-600 shadow-lg"
            />
          </div>
          <h2 className="text-3xl font-bold text-center mb-2 text-green-400">
            {user.lastName} {user.firstName}
          </h2>
          <p className="text-xl mb-4 text-blue-400">{user.devStatus}</p>
          <p className="text-center text-gray-400">{user.bio}</p>
        </>
      )}
      <ContactInfo contacts={contacts} />
    </div>
  );
}
