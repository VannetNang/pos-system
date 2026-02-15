"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const deleteProductForm = async (id: number, _: any) => {
  try {
    const cookie = await cookies();

    const token = cookie.get("token")?.value;

    if (!token) return null;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return { success: false, errors: data.errors, message: data.message };
    }

    // use this to re-cache the data; making re-stale our old data
    revalidatePath("/admin/product");

    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";

    return {
      success: false,
      message: errorMessage,
    };
  }
};
