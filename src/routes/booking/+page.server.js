import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { booking } from '$lib/server/db/schema';

export const actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();

		const checkin = data.get("checkin");
		const checkout = data.get("checkout");
		const guests = data.get("guests");

		// ✅ SAVE BOOKING FIRST
		await db.insert(booking).values({
			userId: locals.user?.id, // important
			roomId: 1, // temporary (or from selected room)
			checkIn: checkin,
			checkOut: checkout
		});

		// THEN redirect
		throw redirect(303, `/rooms?checkin=${checkin}&checkout=${checkout}&guests=${guests}`);
	}
};