import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { room, booking } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function POST({ request }) {
	const { roomType } = await request.json();

	// Find all rooms of the requested type
	const rooms = await db
		.select()
		.from(room)
		.where(eq(room.type, roomType));

	if (rooms.length === 0) {
		return json({
			available: false,
			message: 'No rooms of this type exist.'
		});
	}

	// For now we only check if any room is marked available
	const availableRoom = rooms.find((r) => r.available === 1);

	if (!availableRoom) {
		return json({
			available: false,
			message: 'No available rooms.'
		});
	}

	return json({
		available: true,
		room: availableRoom
	});
}