"use client"
import type React from "react"
import { SessionProvider } from "next-auth/react"
import { Navbar } from "./navbar"
import { Footer } from "./footer"
import { Toaster } from "../ui/toaster"
import { UserProvider } from "../utils/user-provider"

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <SessionProvider>
      <UserProvider>
        <Navbar>
          <main className="flex-1 min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
            {children}
            <Toaster />
          </main>
          <Footer />
        </Navbar>
      </UserProvider>
    </SessionProvider>
  )
}

