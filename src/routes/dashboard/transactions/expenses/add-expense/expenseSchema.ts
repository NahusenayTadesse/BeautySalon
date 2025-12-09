import { z } from 'zod/v4';
import { MAX_FILE_SIZE, ACCEPTED_FILE_TYPES } from '$lib/zodschemas/appointmentSchema';

/**
 * Zod schema for inserting a new expense record.
 * This corresponds to the 'expenses' table.
 */
export const insertExpenseSchema = z.object({
	expenseDate: z.string().min(1, { message: 'Expense date is required.' }),

	type: z
		.number('Expense Type is Required')
		.int()
		.positive({ message: 'Type ID must be positive.' }),

	description: z
		.string()
		.max(255, { message: 'Description cannot exceed 255 characters.' })
		.optional(),

	total: z
		.number('Amount is Required')
		.positive({ message: 'Total must be a positive number.' })
		.transform((val) => parseFloat(val.toFixed(2))) // Ensure only two decimal places
		.refine(
			(val) => {
				const totalDigits = val.toString().replace('.', '').length;
				return totalDigits <= 10;
			},
			{ message: 'Amount value is too large.' }
		),
	reciept: z
		.instanceof(File, { message: 'A file is required.' })
		.refine((file) => file.size > 0, 'File cannot be empty.')
		.refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 10MB.`)
		.refine(
			(file) => ACCEPTED_FILE_TYPES.includes(file.type),
			'Please upload a valid image (JPG, PNG, WebP, HEIC/HEIF) or PDF.'
		)
});

// To use this schema for a form, you might extract the type:
export type InsertExpenseForm = z.infer<typeof insertExpenseSchema>;
