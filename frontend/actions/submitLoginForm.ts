"use server";

import { loginSchema } from "@/schemas/authSchema";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function submitLoginForm(_: any, formData: FormData) {
  let isSuccess = false;

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
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/login`,
      {
        method: "POST",
        body: JSON.stringify(validated.data),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        message: data.error || "Authentication failed.",
      };
    }  

    const cookie = await cookies();
    cookie.set("token", data.data.token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });

    isSuccess = true;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";

    return {
      success: false,
      message: errorMessage,
    };
  }

  if (isSuccess) {
    redirect("/");
  }
}
