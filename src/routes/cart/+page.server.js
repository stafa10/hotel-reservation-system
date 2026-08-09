import { error } from '@sveltejs/kit';

export const actions = {
	checkout: async () => {
		throw error(
			500,
			'This checkout action is no longer used. Checkout is handled by /checkout.'
		);
	}
};