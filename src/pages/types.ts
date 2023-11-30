import { z } from "zod";

export const SignupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Za-z0-9]+/, {
      message: "Password must contain letters and numbers",
    }),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type Signup = z.infer<typeof SignupSchema>;
export type Login = z.infer<typeof LoginSchema>;
