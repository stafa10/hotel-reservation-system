import { redirect, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { room, feedback, enquiry, booking, user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function load({ locals }) {
	if (!locals.user) {
		throw redirect(303, '/auth/login');
	}

	if (locals.user.role !== 'admin') {
		throw error(403, 'Access denied');
	}

	const rooms = await db.select().from(room);

	const feedbacks = await db.select().from(feedback);

	const enquiries = await db.select().from(enquiry);

	const bookings = await db
		.select({
			id: booking.id,
			roomId: booking.roomId,
			checkIn: booking.checkIn,
			checkOut: booking.checkOut,
			roomNumber: room.roomNumber,
			roomType: room.type,
			userEmail: user.email
		})
		.from(booking)
		.leftJoin(room, eq(booking.roomId, room.id))
		.leftJoin(user, eq(booking.userId, user.id));
	console.log('BOOKINGS:', bookings);
	return {
		rooms,
		feedbacks,
		enquiries,
		bookings
	};
}

export const actions = {
	deleteFeedback: async ({ request, locals }) => {
		if (locals.user?.role !== 'admin') {
			throw redirect(303, '/');
		}

		const data = await request.formData();
		const id = Number(data.get('id'));

		await db.delete(feedback).where(eq(feedback.id, id));

		return { success: true };
	},

	deleteEnquiry: async ({ request, locals }) => {
		if (locals.user?.role !== 'admin') {
			throw redirect(303, '/');
		}

		const data = await request.formData();
		const id = Number(data.get('id'));

		await db.delete(enquiry).where(eq(enquiry.id, id));

		return { success: true };
	},

	deleteBooking: async ({ request, locals }) => {
		if (locals.user?.role !== 'admin') {
			throw redirect(303, '/');
		}

		const data = await request.formData();
		const bookingId = Number(data.get('bookingId'));

		await db.delete(booking).where(eq(booking.id, bookingId));

		return { success: true };
	},

	toggleRoom: async ({ request, locals }) => {
		if (locals.user?.role !== 'admin') {
			throw redirect(303, '/');
		}

		const data = await request.formData();

		const roomId = Number(data.get('roomId'));
		const available = Number(data.get('available'));

		await db
			.update(room)
			.set({ available: available ? 0 : 1 })
			.where(eq(room.id, roomId));

		return { success: true };
	}
};
