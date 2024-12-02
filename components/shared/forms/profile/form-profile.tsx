"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye } from "lucide-react";
import { useState } from "react";

export const ProfileForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="mt-2 mb-3">
      <span>Password</span>
      <div className="flex gap-2">
        <Input
          type={showPassword ? "text" : "password"}
          name="password"
          id="password"
        />
        <Button
          className=" bg-white text-black hover:bg-white hover:text-black"
          onClick={() => setShowPassword(!showPassword)}
        >
          <Eye />
        </Button>
      </div>
    </div>
  );
};
