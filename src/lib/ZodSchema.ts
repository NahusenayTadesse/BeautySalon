import { z } from 'zod/v4';

export const loginSchema = z.object({
  email: z.email({ error: "Invalid email address" }),
  password: z.string().min(8, { error: "Password must be at least 8 characters" }),
});

export type LoginSchema = typeof loginSchema;



export const inventoryItemSchema = z.object({
  productName: z.string().min(1, { message: 'Product Name is required.' }),
  description: z.string().optional(),
  quantity: z.coerce.number().int().positive({ message: 'Quantity must be a positive integer.' }),
  price: z.coerce.number().positive({ message: 'Price must be a positive number.' }),
  supplier: z.string().min(1, { message: 'Supplier is required.' }),
});

export type InventoryItemSchema = typeof inventoryItemSchema;
