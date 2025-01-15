"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { getUserSession } from "@/lib/get-session-server";

export const InputImage = (props: {
  onChange: (url: string) => string;
  userId: number;
}) => {
  const [showError, setShowError] = useState(false);
  return (
    <>
      <Input
        type="file"
        accept="image/*"
        onChange={async (e) => {
          const file = e.target.files?.item(0);
          if (!file) return;
          if (file.size > 5 * 1024 * 1024) return setShowError(true);
          else setShowError(false);
          const res = await fetch(`/api/update-avatar/${props.userId}`, {
            method: "post",
            headers: {
              "Content-Type": file.type,
            },
            body: Buffer.from(await file.arrayBuffer()),
          });
          if (res.status != 200) return;

          const obj = await res.json();
          if (!obj.url) return;

          props.onChange(obj.url);
        }}
      />

      <span
        style={{
          color: "red",
          display: showError ? "block" : "none",
        }}
      >
        Размер файла больше чем пашел нахуй
      </span>
    </>
  );
};