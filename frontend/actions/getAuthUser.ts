import { User } from "@/types/authType";
import { cookies } from "next/headers";

export const getAuthUser = async (): Promise<User | null> => {
  // try {
  //   const cookie = await cookies();

  //   const token = cookie.get("token")?.value;

  //   if (!token) return null;

  //   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Accept: "application/json",
  //       Authorization: `Bearer ${token}`,
  //     },
  //     cache: "no-store",
  //   });

  //   if (!response.ok) {
  //     return null;
  //   }

  //   return await response.json();
  // } catch (error: unknown) {
  //   const errorMessage =
  //     error instanceof Error ? error.message : "Internal server error";

  //   console.error("Auth User Error: ", errorMessage);

  //   return null;
  // }

  return {
    id: 1,
    name: "Super Boing",
    password: "password",
    role: "admin",
    email: "boing@gmail.com",
    created_at: "12",
    updated_at: "12",
  };
};
