"use server";

import { addProductSchema } from "@/schemas/productSchema";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const addProductForm = async (_: any, formData: FormData) => {
  const rawData = {
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    stock_quantity: formData.get("stock_quantity"),
    image_url: formData.get("image_url"),
  };

  const validated = addProductSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: "Invalid input. Please check the highlighted fields.",
      inputs: rawData,
    };
  }

  try {
    const cookie = await cookies();

    const token = cookie.get("token")?.value;

    if (!token) return null;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products`,
      {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return { success: false, errors: data.errors };
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
