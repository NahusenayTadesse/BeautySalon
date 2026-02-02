import { z } from 'zod/v4';

export const terminate = z.object({
	reason: z.string().min(2).max(255),
	terminationDate: z.coerce.string('Termination Date is Required')
});
export type Terminate = z.infer<typeof terminate>;

export const reinstate = z.object({
	newStatus: z.string('New Status is Required')
});

export type Reinstate = z.infer<typeof reinstate>;

export const addSchedule = z.object({
	day: z.number('Day is Required'),
	startTime: z.string('Start Time is required'),
	endTime: z.string('End Time is required'),
	status: z.boolean('Status is Required').default(true)
});
export type AddSchedule = z.infer<typeof addSchedule>;

export const editSchedule = z.object({
	id: z.number('Schedule not found'),
	day: z.number('Day is Required'),
	startTime: z.string('Start Time is required'),
	endTime: z.string('End Time is required'),
	status: z.boolean('Status is Required').default(true)
});
export type EditSchedule = z.infer<typeof editSchedule>;
