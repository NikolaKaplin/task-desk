"use client"

import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { Input } from "../../ui/input"
import { ClearButton } from "../clear-button"
import { ErrorText } from "../error-text"
import { RequiredSymbol } from "../required-symbol"
import { Eye, EyeOff } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect } from "react"
interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
  label?: string
  required?: boolean
  className?: string
  defaultValue?: string
  placeholder?: string
  isMotion?: boolean
}

export const FormInput: React.FC<Props> = ({ className, name, label, required, defaultValue, placeholder, type, isMotion, ...props }) => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext()

  const [showPassword, setShowPassword] = useState(false)
  const value = watch(name)
  const errorText = errors[name]?.message as string

  const onClickClear = () => {
    setValue(name, "", { shouldValidate: true })
  }

  useEffect(() => {
    setValue(name, defaultValue, { shouldValidate: true })
  }, [])

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div>
    {isMotion ? (
      <motion.div
      className={className}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {label && (
        <p className="font-medium mb-2 text-gray-300">
          {label} {required && <RequiredSymbol />}
        </p>
      )}

      <div className="relative">
        <Input
        placeholder={placeholder ? placeholder : ""}
          className="h-12 text-md bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500"
          type={type === "password" && showPassword ? "text" : type}
          {...register(name)}
          {...props}
        />
        {value && type !== "password" && (
          <ClearButton onClick={onClickClear} className="text-gray-400 hover:text-white" />
        )}
        {type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>

      {errorText && <ErrorText text={errorText} className="mt-2 text-red-400" />}
    </motion.div>
    ) : (<div>
      {label && (
        <p className="font-medium mb-2 text-gray-300">
          {label} {required && <RequiredSymbol />}
        </p>
      )}

      <div className="relative">
        <Input
        placeholder={placeholder ? placeholder : ""}
          className="h-12 text-md bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500"
          type={type === "password" && showPassword ? "text" : type}
          {...register(name)}
          {...props}
        />
        {value && type !== "password" && (
          <ClearButton onClick={onClickClear} className="text-gray-400 hover:text-white" />
        )}
        {type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>

      {errorText && <ErrorText text={errorText} className="mt-2 text-red-400" />}</div>)}
      </div>
  )
}

