import { json } from '@sveltejs/kit';
import { stripe } from '$lib/server/stripe';
import { db } from '$lib/server/db';
import { booking } from '$lib/server/db/schema';
import { and, eq, lt, gt } from 'drizzle-orm';

export const POST = async ({ request, locals }) => {
	// Prevent checkout if user isn't logged in
	if (!locals.user) {
		return json(
			{ error: 'Please log in before booking.' },
			{ status: 401 }
		);
	}

	const { cart } = await request.json();

	if (!cart?.length) {
		return json(
			{ error: 'Cart is empty' },
			{ status: 400 }
		);
	}

	const item = cart[0];

	console.log(item);

	// Check if room is already booked
	const existingBooking = await db.query.booking.findFirst({
		where: and(
			eq(booking.roomId, item.roomId),
			lt(booking.checkIn, item.checkOut),
			gt(booking.checkOut, item.checkIn)
		)
	});

	if (existingBooking) {
		return json(
			{ error: 'This room is already booked for these dates.' },
			{ status: 400 }
		);
	}

	const session = await stripe.checkout.sessions.create({
		mode: 'payment',

		payment_method_types: ['card'],

		line_items: cart.map((item) => ({
			price_data: {
				currency: 'eur',
				product_data: {
					name: item.type
				},
				unit_amount: item.total * 100
			},
			quantity: 1
		})),

		metadata: {
			userId: locals.user.id,
			roomId: String(item.roomId),
			checkIn: item.checkIn,
			checkOut: item.checkOut
		},

		success_url:
			'http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}',

		cancel_url: 'http://localhost:5173/cart'
	});

	return json({
		url: session.url
	});
};