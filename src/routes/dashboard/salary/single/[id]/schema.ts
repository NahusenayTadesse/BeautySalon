import { z } from 'zod/v4';
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from "$lib/zodschemas/appointmentSchema";


export const addLeavePayrollSchema = z.object({
  month: z.string('Payment Month is required'),
  year: z.number('Payment Year is required').int().min(2020),
  payPeriodStart: z.string('Pay Start is Requried'),  // ISO date string  YYYY-MM-DD
  payPeriodEnd: z.string('Pay End is Required'),
  baseSalary: z.string('Salary not found, Please add Salary at the Staff Page').regex(/^\d+(\.\d{1,2})?$/), // decimal as string
  overtime: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
  deductions: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
  commissions: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
  bonus: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
  netAmount: z.string("Can not calculate Net Amount").regex(/^\d+(\.\d{1,2})?$/),
  paidAmount: z.string("Paid Amount is Needed").regex(/^\d+(\.\d{1,2})?$/),
  taxAmount: z.coerce.number().optional(),
  paymentMethod: z.number('Payment Method is Required').int().positive(),
  paymentDate: z.string('Payment Date is required'),
  notes: z.string().max(255).optional(),
  reciept: z
    .instanceof(File, { message: 'A file is required.' })
    .refine((file) => file.size > 0, 'File cannot be empty.')
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 10MB.`)
    .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), 
      'Please upload a valid image (JPG, PNG, WebP, HEIC/HEIF) or PDF.'),
});

export type AddLeavePayrollInput = z.infer<typeof addLeavePayrollSchema>;