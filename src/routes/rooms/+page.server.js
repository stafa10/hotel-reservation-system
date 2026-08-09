import { db } from '$lib/server/db';
import { room, booking } from '$lib/server/db/schema';
import { and, eq, lt, gt, notInArray } from 'drizzle-orm';

export async function load({ url }) {
	const checkin = url.searchParams.get('checkin');
	const checkout = url.searchParams.get('checkout');

	let rooms = await db.query.room.findMany();

	if (rooms.length === 0) {
		await db.insert(room).values([
			{
				roomNumber: '101',
				type: 'single',
				beds: 1,
				price: 120,
				image: ''
			},
			{
				roomNumber: '102',
				type: 'double',
				beds: 2,
				price: 180,
				image: ''
			},
			{
				roomNumber: '201',
				type: 'deluxe',
				beds: 2,
				price: 250,
				image: ''
			},
			{
				roomNumber: '301',
				type: 'suite',
				beds: 3,
				price: 400,
				image: ''
			}
		]);

		rooms = await db.query.room.findMany();
	}

	if (!checkin || !checkout) {
		return {
			rooms
		};
	}

	const bookedRooms = await db
		.select({
			roomId: booking.roomId
		})
		.from(booking)
		.where(
			and(
				lt(booking.checkIn, checkout),
				gt(booking.checkOut, checkin)
			)
		);

	const bookedIds = bookedRooms.map((b) => b.roomId);

	const availableRooms =
		bookedIds.length === 0
			? rooms
			: await db
					.select()
					.from(room)
					.where(notInArray(room.id, bookedIds));

	return {
		rooms: availableRooms
	};
}