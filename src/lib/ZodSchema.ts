import { z } from 'zod/v4';

export const loginSchema = z.object({
	email: z.email({ error: 'Invalid email address' }),
	password: z.string().min(8, { error: 'Password must be at least 8 characters' })
});
export type LoginSchema = typeof loginSchema;

export const addUserSchema = z.object({
  name: z
    .string()
    .min(1, "Full Name is required")
    .max(100, "Full Name must be less than 100 characters"),
  email: z
    .email("Invalid email address")
    .min(1, "Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password must be less than 128 characters"),
  role: z.number("Role is required"),
});

export type AddUserSchema = typeof addUserSchema;

export const inventoryItemSchema = z.object({
	productName: z.string().min(1, { message: 'Product Name is required.' }),
	description: z
		.string()
		.max(500, { message: "Product description can't be more than 500 characters." })
		.optional(),
	quantity: z.coerce
		.number()
		.int({ message: 'Quantity can only be full numbers, no decimals.' })
		.positive({ message: 'Quantity must be a positive number.' }),
	price: z.coerce.number().positive({ message: 'Price must be a positive number.' }),
	supplier: z.string().min(1, { message: 'Supplier is required.' })
});

export type InventoryItemSchema = typeof inventoryItemSchema;

export const serviceSchema = z.object({
	serviceName: z.string().min(1, { message: 'Service Name is required.' }),
	description: z.string().optional(),
  category: z.number('Category cannot be empty. Please select a Category'),
	durationMinutes: z.coerce
		.number()
		.int()
		.positive({ message: 'Duration Minutes must be a positive integer.' }),
	price: z.coerce.number().positive({ message: 'Price must be a positive number.' })
});

export type ServiceSchema = typeof serviceSchema;


export const staffSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name is too long"),

  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Last name is too long"),

  email: z
    .email()
    .min(1, "Email is required"),
  phone: z
    .string()
    .min(7, "Phone number must be at least 7 digits")
    .max(20, "Phone number is too long")
    .regex(/^[\d+\-\s()]+$/, "Invalid phone number format"),

  position: z
    .number("Position is required")
});



export type StaffForm = z.infer<typeof staffSchema>;


export const createRoleSchema = z.object({
  name: z
    .string()
    .min(1, "Role name is required")
    .max(100, "Role name must be under 100 characters"),

  description: z
    .string()
    .min(1, "Role description is required")
    .max(500, "Role description must be under 500 characters"),

  permissions: z
    .array(z.string().min(1))
    .nonempty("At least one permission must be selected")
});


export type CreateRoleSchema = z.infer<typeof createRoleSchema>;

export const positionSchema = z.object({
  name: z
    .string()
    .min(1, "Role name is required")
    .max(100, "Role name must be under 100 characters"),

  description: z
    .string()
    .min(1, "Role description is required")
    .max(500, "Role description must be under 500 characters")
});
export type PositionSchema = z.infer<typeof positionSchema>;

export const serviceCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Role name is required")
    .max(100, "Role name must be under 100 characters"),

  description: z
    .string()
    .min(1, "Role description is required")
    .max(500, "Role description must be under 500 characters")
});



export type ServiceCategorySchema = z.infer<typeof serviceCategorySchema>;
