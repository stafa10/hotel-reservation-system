import { auth } from '$lib/server/auth';
import { seedRooms } from '$lib/server/seed';

let seeded = false;

export async function handle({ event, resolve }) {
	if (!seeded) {
		await seedRooms();
		seeded = true;
	}

	return auth.handle({ event, resolve });
}