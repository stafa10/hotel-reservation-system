import { db } from '$lib/server/db';
import { room } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export async function load({ params, url }) {
	const roomData = await db.query.room.findFirst({
		where: eq(room.id, Number(params.id))
	});

	if (!roomData) {
		throw error(404, 'Room not found');
	}

	return {
		room: roomData,
		checkin: url.searchParams.get('checkin') || '',
		checkout: url.searchParams.get('checkout') || '',
		guests: url.searchParams.get('guests') || ''
	};
}