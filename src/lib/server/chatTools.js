import { db } from '$lib/server/db';
import { room, booking } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function checkAvailability(date, guests) {
	const rooms = await db
		.select()
		.from(room)
		.where(eq(room.available, 1));

	return rooms;
}

export async function createBooking(data) {
	const bookingResult = await db.insert(booking).values({
		userId: data.userId,
		roomId: data.roomId,
		checkIn: data.checkIn,
		checkOut: data.checkOut
	});

	return bookingResult;
}