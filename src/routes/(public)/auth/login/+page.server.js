import { fail, redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import { APIError } from 'better-auth/api';

export const load = async (event) => {
	if (event.locals.user) throw redirect(302, '/account');
	return {};
};

export const actions = {
	signInEmail: async (event) => {
		const formData = await event.request.formData();

		const email = formData.get('email')?.toString() ?? '';
		const password = formData.get('password')?.toString() ?? '';

		console.log("LOGIN ATTEMPT >>>>>>", { email });

		// basic validation (keep it simple here)
		if (!email || !password) {
			return fail(400, { message: 'Email and password are required' });
		}

		try {
			const result = await auth.api.signInEmail({
				body: {
					email,
					password
				}
			});

			console.log("LOGIN SUCCESS >>>>>>", result);

		} catch (error) {
			console.error("LOGIN ERROR >>>>>>", error);

			if (error instanceof APIError) {
				return fail(400, { message: error.message || 'Invalid credentials' });
			}

			return fail(500, { message: 'Unexpected login error' });
		}

		throw redirect(303, '/account');
	}
};