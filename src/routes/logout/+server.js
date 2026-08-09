import { auth } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export async function POST(event) {
	try {
		await auth.api.signOut({
			headers: event.request.headers
		});
	} catch (err) {
		console.error('Logout error:', err);
	}

	throw redirect(303, '/auth/login');
}