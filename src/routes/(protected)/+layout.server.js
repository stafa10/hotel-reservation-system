import { redirect } from '@sveltejs/kit';
import { usersService } from '$lib/server/services/users-services';

export const load = async ({ locals }) => {

	if (!locals.user) {
		throw redirect(303, '/auth/login');
	}


	const user = await usersService.getById((locals.user.id));


	return {
		user
	};
};