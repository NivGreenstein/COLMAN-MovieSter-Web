import { z } from 'zod';

export const CoordinateZod = z.object({
	clickTime: z
		.string()
		.regex(
			/^([1-9]|[12][0-9]|3[01])[/]([1-9]|1[012])[/](19|20)\d\d, \d{2}:\d{2}:\d{2}$/
		),
	coordinate: z.object({
		lon: z.number().nonnegative(),
		lat: z.number().nonnegative(),
	}),
});
export type Coordinate = z.infer<typeof CoordinateZod>;
