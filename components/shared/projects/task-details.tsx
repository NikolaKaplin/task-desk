"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { Task } from "./task-column";
import { getUsers } from "@/app/actions";
import { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
interface TaskDetailsProps {
  task: Task;
  onClose: () => void;
  usersArr: any;
}

export default function TaskDetails({
  task,
  onClose,
  usersArr,
}: TaskDetailsProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
                {usersArr ? (
      <DialogContent className="bg-gray-800 text-green-400 border-0 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl font-bold text-green-500">
            {task.title}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <h3 className="text-base md:text-lg font-semibold mb-2">
            Description
          </h3>
          <p className="text-sm md:text-base text-gray-300">
            {task.description}
          </p>
        </div>
        {task.image && (
          <div className="mt-4">
            <img
              src={task.image || "/placeholder.svg"}
              alt={task.name}
              className="rounded-md w-full max-h-48 md:max-h-64 object-cover"
            />
          </div>
        )}
        <div className="mt-4">
          <h3 className="text-base md:text-lg font-semibold mb-2">
            Performers
          </h3>
            <div className="flex flex-wrap gap-2">
              {JSON.parse(task.performers).map((performer, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="border-green-500 text-green-400 text-xs md:text-sm gap-2"
                >
                  {usersArr.find((user) => user.id === performer)?.firstName}{" "}
                  {usersArr.find((user) => user.id === performer)?.lastName}
                  <Avatar>
                    <AvatarImage src={usersArr.find((user) => user.id === performer)?.avatar} />
                  </Avatar>
                </Badge>
              ))}
            </div>
        </div>
        <div className="mt-4">
          <Badge
            variant="secondary"
            className="bg-gray-700 text-green-400 text-xs md:text-sm"
          >
            {task.taskStatus}
          </Badge>
        </div>
      </DialogContent>
    ) : null}
    </Dialog>
  );
}
