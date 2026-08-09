import { auth } from '$lib/server/auth';

export const actions = {
	default: async ({ request, url }) => {
		const data = await request.formData();

		const password = data.get('password')?.toString();

		const token = url.searchParams.get('token');

		try {
			await auth.api.resetPassword({
				body: {
					newPassword: password,
					token
				}
			});

			return {
				message: 'Password updated successfully'
			};
		} catch (err) {
			console.error(err);

			return {
				message: 'Failed to reset password'
			};
		}
	}
};