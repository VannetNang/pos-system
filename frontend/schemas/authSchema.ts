import * as z from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim() // Removes accidental spaces
    .email("Please enter a valid work email"),

  password: z
    .string()
    .min(2, "Password must be at least 2 characters")
    .max(32, "Password cannot exceed 32 characters"),
});
