import { auth } from '$lib/server/auth';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const email = data.get('email')?.toString();

		try {
			await auth.api.requestPasswordReset({
				body: {
					email,
					redirectTo: 'http://localhost:5173/auth/reset-password'
				}
			});

			return {
				message: 'Password reset email sent'
			};
		} catch (err) {
			console.error(err);

			return {
				message: 'Failed to send reset email'
			};
		}
	}
};