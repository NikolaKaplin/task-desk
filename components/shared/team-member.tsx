"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";

interface TeamMemberProps {
  firstName: string;
  lastName: string;
  avatar: string;
  bio: string;
  devStatus: string;
  contacts: string;
}

export function TeamMember({
  firstName,
  lastName,
  avatar,
  bio,
  devStatus,
  contacts,
}: TeamMemberProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  let telegramUsername = null;
  try {
    if (contacts) {
      telegramUsername = JSON.parse(contacts).telegram;
    }
  } catch (error) {
    console.error("Error parsing contacts:", error);
  }

  // Parse devStatus into an array for better display
  const statusArray = devStatus
    ? devStatus.split(",").map((s) => s.trim())
    : [];

  return (
    <>
      <div
        className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-blue-900/20 cursor-pointer border border-gray-700 hover:border-blue-500/30"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="aspect-square overflow-hidden relative group">
          <img
            src={avatar || "/placeholder.svg"}
            alt={`${firstName} ${lastName}`}
            className="w-full h-full object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-110"
          />
          {telegramUsername && (
            <div className="absolute bottom-3 right-3 bg-blue-500 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <a
                href={`https://t.me/${telegramUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="block"
                title={`Telegram: @${telegramUsername}`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 text-white"
                >
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </a>
            </div>
          )}
        </div>
        <div className="p-4">
          <h2 className="text-lg font-bold mb-1 text-white">
            {firstName} {lastName}
          </h2>
          <div className="flex flex-wrap gap-1 mb-2">
            {statusArray.map((status, index) => (
              <span
                key={index}
                className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full"
              >
                {status}
              </span>
            ))}
          </div>
          <p className="text-gray-300 text-sm line-clamp-2">{bio}</p>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-3xl rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {firstName} {lastName}
            </DialogTitle>
            <div className="flex flex-wrap gap-1 mt-2">
              {statusArray.map((status, index) => (
                <span
                  key={index}
                  className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full"
                >
                  {status}
                </span>
              ))}
            </div>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="aspect-square overflow-hidden rounded-lg border border-gray-700">
              <img
                src={avatar || "/placeholder.svg"}
                alt={`${firstName} ${lastName}`}
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <p className="text-gray-300">{bio}</p>

              {telegramUsername && (
                <div className="flex items-center space-x-2 bg-gray-700 p-3 rounded-lg">
                  <div className="bg-blue-500 p-2 rounded-full">
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 text-white"
                    >
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">Telegram</p>
                    <a
                      href={`https://t.me/${telegramUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-blue-400 flex items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      @{telegramUsername}
                      <ExternalLink className="ml-1 h-4 w-4" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
