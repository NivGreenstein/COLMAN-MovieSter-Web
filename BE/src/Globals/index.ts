import { ZodIssue } from 'zod';

export type errorResponse = { message: string | ZodIssue[] };
