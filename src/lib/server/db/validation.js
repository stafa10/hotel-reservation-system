import { z } from 'zod';

/** =========================
 * AUTH (REGISTER / LOGIN)
 * ========================= */
export const registerAuthSchema = z.object({
	name: z.string().min(1),
	email: z.string().email(),
	password: z.string().min(6),
	dob: z.string().nullable().optional()
});

/** =========================
 * USERS
 * ========================= */

// Used for: getById, updateProfile
export const idSchema = z.object({
	id: z.string().min(1)
});

// Used for updating user profile fields
export const updateProfileSchema = z.object({
	name: z.string().min(1).optional(),
	email: z.string().email().optional(),
	dob: z.string().nullable().optional()
});

/** =========================
 * OPTIONAL: future-proof schemas
 * (safe to ignore for now)
 * ========================= */

export const getUserByEmailSchema = z.object({
	email: z.string().email()
});

export const deleteUserSchema = z.object({
	id: z.string().min(1)
});