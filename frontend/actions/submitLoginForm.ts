"use server";

import { loginSchema } from "@/schemas/authSchema";

export async function submitLoginForm(_: any, formData: FormData) {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const validated = loginSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: "Invalid input. Please check the highlighted fields.",
    };
  }

  try {
    console.log(validated);
  } catch (err) {
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
