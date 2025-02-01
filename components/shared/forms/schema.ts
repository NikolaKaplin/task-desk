import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Введите корректную почту" }),
  password: z
    .string()
    .min(6, {
      message: "Пароль должен содержать минимум 6 символов",
    }),
});

export const RegisterSchema = z.object({
  firstName: z.string().min(3, {
    message: "Имя пользователя должно содержать минимум 3 символа",
  }),
  lastName: z.string().min(3, {
    message: "Фамилия пользователя должна содержать минимум 3 символа",
  }),
  email: z.string().email({ message: "Введите корректную почту" }),
  password: z
    .string()
    .min(6, {
      message: "Пароль должен содержать минимум 6 символов",
    }),
});

export type TFormLoginValues = z.infer<typeof loginSchema>;
export type TFormRegisterValues = z.infer<typeof RegisterSchema>;
