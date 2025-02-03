"use client"

import type React from "react"
import { useState, useRef, type KeyboardEvent } from "react"
import { LoginForm } from "./login-form"
import { RegisterForm } from "./register-form"
import { motion, AnimatePresence } from "framer-motion"

export const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true)
  const formRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault()
      const inputs = formRef.current?.querySelectorAll("input")
      if (inputs) {
        const currentIndex = Array.from(inputs).findIndex((input) => input === document.activeElement)
        const nextIndex =
          e.key === "ArrowUp" ? (currentIndex - 1 + inputs.length) % inputs.length : (currentIndex + 1) % inputs.length
        inputs[nextIndex].focus()
      }
    } else if (e.key === "Enter") {
      e.preventDefault()
      const submitButton = formRef.current?.querySelector('button[type="submit"]') as HTMLButtonElement | null
      if (submitButton) {
        submitButton.click()
      }
    }
  }

  return (
    <div
      className="flex flex-wrap content-center bg-gradient-to-tl from-gray-900 via-green-800 to-gray-900 min-h-screen w-full justify-center bg-cover p-4"
      onKeyDown={handleKeyDown}
    >
      <motion.div
        className="bg-gray-800 rounded-3xl min-h-96 w-full sm:w-4/5 md:w-3/5 lg:w-2/5 p-5 text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-center text-2xl font-bold text-green-400 mb-6"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Altergemu
        </motion.div>
        <div className="flex justify-center space-x-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsLogin(true)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isLogin ? "bg-green-500 text-white" : "bg-gray-700 text-green-400"
            }`}
          >
            Войти
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsLogin(false)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              !isLogin ? "bg-green-500 text-white" : "bg-gray-700 text-green-400"
            }`}
          >
            Регистрация
          </motion.button>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "login" : "register"}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="p-3 sm:p-5 text-white bg-gray-700 w-full rounded-2xl border border-gray-600"
            ref={formRef}
          >
            {isLogin ? <LoginForm /> : <RegisterForm />}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

