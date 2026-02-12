import * as z from "zod";

export const addProductSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(255, "Name is too long"),

  description: z
    .string()
    .min(1, "Please provide a description")
    .max(1000, "Description is too long"),

  price: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.coerce
      .number({ error: "Price must be a number" })
      .min(0.01, "Price must be at least 0.01"),
  ),

  stock_quantity: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.coerce
      .number({ error: "Stock must be a number" })
      .int("Stock must be a whole number")
      .min(0, "Stock cannot be negative")
      .max(100, "Stock limit exceeded"),
  ),

  image_url: z
    .instanceof(File)
    .refine((file) => file.size > 0, "Product image is required")
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "Image must be less than 5MB",
    )
    .refine(
      (file) =>
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type,
        ),
      "Only .jpg, .png, and .webp formats are supported",
    ),
});

export const editProductSchema = z.object({
  id: z.string().min(1, "Product name is required"),

  name: z
    .string()
    .min(1, "Product name is required")
    .max(255, "Name is too long"),

  description: z
    .string()
    .min(1, "Please provide a description")
    .max(1000, "Description is too long"),

  price: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.coerce
      .number({ error: "Price must be a number" })
      .min(0.01, "Price must be at least 0.01"),
  ),

  stock_quantity: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.coerce
      .number({ error: "Stock must be a number" })
      .int("Stock must be a whole number")
      .min(0, "Stock cannot be negative")
      .max(100, "Stock limit exceeded"),
  ),

  image_url: z
    .any()
    // 1. Pre-process: If it's a size 0 file, turn it into 'undefined'
    .transform((file) => {
      if (file instanceof File && file.size > 0) return file;
      return undefined;
    })
    // 2. Now 'image_url' is either a REAL File or 'undefined'
    .optional()
    .refine((file) => {
      if (!file) return true; // Skip if it's the undefined we just created
      return file.size <= 5 * 1024 * 1024;
    }, "Image must be less than 5MB")
    .refine((file) => {
      if (!file) return true;
      return ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
        file.type,
      );
    }, "Only .jpg, .png, and .webp formats are supported"),
});
