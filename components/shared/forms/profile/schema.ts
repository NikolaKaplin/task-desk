import { z } from "zod";

export const profileFormSchema = z.object({
  id: z.string(),
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  bio: z.string().max(350, {
    message: "Bio must not be longer than 350 characters.",
  }),
  devStatus: z.array(z.string()).min(1, {
    message: "Please select at least one developer status.",
  }),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
