import { z } from "zod";

export const profileSchema = z.object({
  firstName: z
    .string()
    .min(4, {
      message: "Имя пользователя должно содержать минимум 4 символа",
    })
    .max(15, {
      message: "Имя пользователя должно содержать максимум 15 символов",
    }),
  lastName: z
    .string()
    .min(4, {
      message: "Фамилия пользователя должна содержать минимум 4 символа",
    })
    .max(15, {
      message: "Фамилия пользователя должна содержать максимум 15 символов",
    }),
  email: z.string().email({ message: "Введите корректную почту" }),
});

export type TFormProfileValues = z.infer<typeof profileSchema>;
