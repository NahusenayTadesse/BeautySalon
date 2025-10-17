// salesSchema.ts
import { z } from "zod";

/* ------------------------------------------------------------------ */
/* helpers                                                            */
/* ------------------------------------------------------------------ */
const toNum = (v: unknown) => (v === "" || v == null ? 0 : Number(v));

const money = z
  .string()
  .or(z.number())
  .transform(toNum)
  .refine((n) => !Number.isNaN(n), "Must be a valid number");

/* ------------------------------------------------------------------ */
/* single items                                                       */
/* ------------------------------------------------------------------ */
const productLineSchema = z.object({
  staff: z
    .string()
    .min(1, "Staff member is required when a product is added"),
  product: z
    .number({ invalid_type_error: "Product is required" })
    .int()
    .positive("Product is required"),
  noofproducts: z
    .number()
    .int()
    .positive("Number of products must be at least 1"),
  tip: money,
});

const serviceLineSchema = z.object({
  staff: z
    .string()
    .min(1, "Staff member is required when a service is added"),
  service: z
    .number({ invalid_type_error: "Service is required" })
    .int()
    .positive("Service is required"),
  serviceTip: money,
});

/* ------------------------------------------------------------------ */
/* entire form                                                        */
/* ------------------------------------------------------------------ */
export const salesSchema = z
  .object({
    products: z.array(productLineSchema),
    services: z.array(serviceLineSchema),
  })
  .refine(
    (data) => data.products.length > 0 || data.services.length > 0,
    "At least one product or service must be added"
  );

/* ------------------------------------------------------------------ */
/* TypeScript type                                                    */
/* ------------------------------------------------------------------ */
export type SalesForm = z.infer<typeof salesSchema>;