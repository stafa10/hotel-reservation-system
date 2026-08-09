import { usersService } from '$lib/server/services/users-services';
import { db } from '$lib/server/db';
import { booking } from '$lib/server/db/schema';


export async function load({ locals }) {
	if (!locals.user) {
		return {
			user: null
		};
	}

	const fullUser = await usersService.getById(locals.user.id);

	return {
		user: fullUser
	};
}