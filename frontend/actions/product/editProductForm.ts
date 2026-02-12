"use server";

import { editProductSchema } from "@/schemas/productSchema";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const editProductForm = async (_: any, formData: FormData) => {
  const rawData = {
    id: formData.get("id"),
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    stock_quantity: formData.get("stock_quantity"),
    image_url: formData.get("image_url"),
  };

  let validated = editProductSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: "Invalid input. Please check the highlighted fields.",
    };
  }

  let newFormData = new FormData();

  newFormData.append("id", validated.data.id);
  newFormData.append("name", validated.data.name);
  newFormData.append("description", validated.data.description);
  newFormData.append(
    "stock_quantity",
    validated.data.stock_quantity.toString(),
  );
  newFormData.append("price", validated.data.price.toString());

  if (validated.data.image_url !== undefined) {
    newFormData.append("image_url", validated.data.image_url);
  }

  try {
    const cookie = await cookies();

    const token = cookie.get("token")?.value;

    if (!token) return null;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${validated.data.id}`,
      {
        method: "PUT",
        body: newFormData,
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
