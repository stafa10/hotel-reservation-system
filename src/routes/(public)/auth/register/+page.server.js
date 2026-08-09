import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';

import { fail } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import { APIError } from 'better-auth/api';

export const actions = {
	signUpEmail: async (event) => {
		const formData = await event.request.formData();

		const email = formData.get('email')?.toString().trim() ?? '';
		const password = formData.get('password')?.toString() ?? '';
		const name = formData.get('name')?.toString().trim() ?? '';

		// Required fields
		if (!name || !email || !password) {
			return fail(400, {
				success: false,
				message: 'Please fill in all fields.'
			});
		}

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!emailRegex.test(email)) {
			return fail(400, {
				success: false,
				message: 'Please enter a valid email address.'
			});
		}

		// Password validation
		const hasMinLength = password.length >= 8;
		const hasUppercase = /[A-Z]/.test(password);
		const hasLowercase = /[a-z]/.test(password);
		const hasNumber = /\d/.test(password);
		const hasSpecial = /[^A-Za-z0-9]/.test(password);

		if (!hasMinLength || !hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
			return fail(400, {
				success: false,
				message:
					'Password must be at least 8 characters and contain an uppercase letter, a lowercase letter, a number and a special character.'
			});
		}
		// Check if email already exists
		const existingUser = await db.query.user.findFirst({
			where: eq(user.email, email)
		});

		if (existingUser) {
			if (existingUser.emailVerified) {
				return fail(400, {
					success: false,
					message: 'An account with this email already exists. Please login instead.'
				});
			}

			return fail(400, {
				success: false,
				message:
					'This email is already registered but has not been verified yet. Please check your inbox for the verification email.'
			});
		}

		try {
			const result = await auth.api.signUpEmail({
				body: {
					email,
					password,
					name
				},
				event
			});

			console.log('========================');
			console.log('SIGNUP SUCCESS');
			console.log(result);
			console.log('========================');

			return {
				success: true,
				message: 'Registration successful! Please check your email to verify your account.'
			};
		} catch (error) {
			console.log('========================');
			console.log('SIGNUP ERROR');
			console.dir(error, { depth: null });
			console.log('========================');

			if (error instanceof APIError) {
				const message = error.body?.message || error.message || 'Registration failed';

				if (
					message.toLowerCase().includes('already') ||
					message.toLowerCase().includes('exists') ||
					message.toLowerCase().includes('email')
				) {
					return fail(400, {
						success: false,
						message: 'An account with this email already exists. Please login instead.'
					});
				}

				return fail(400, {
					success: false,
					message
				});
			}

			return fail(500, {
				success: false,
				message: 'Registration failed.'
			});
		}
	}
};
