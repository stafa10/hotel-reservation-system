import { stripe } from '$lib/server/stripe';
import { resend } from '$lib/server/resend';
import { db } from '$lib/server/db';
import { booking, room } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = async ({ url }) => {
	const sessionId = url.searchParams.get('session_id');

	if (!sessionId) {
		return { ok: false };
	}

	const session = await stripe.checkout.sessions.retrieve(sessionId);

	console.log('Stripe Session:', session);

	// Save booking if metadata exists
	if (session.metadata) {
		try {
			const roomId = Number(session.metadata.roomId);

			// Avoid duplicate bookings
			const existing = await db.query.booking.findFirst({
				where: eq(booking.userId, session.metadata.userId)
			});

			if (!existing) {
				await db.insert(booking).values({
					roomId,
					userId: session.metadata.userId,
					checkIn: session.metadata.checkIn,
					checkOut: session.metadata.checkOut
				});

				await db
					.update(room)
					.set({ available: 0 })
					.where(eq(room.id, roomId));

				console.log('Booking inserted successfully');
			} else {
				console.log('Booking already exists');
			}
		} catch (err) {
			console.error('Booking save failed:', err);
		}
	}

	const customerEmail = session.customer_details?.email;

	if (customerEmail) {
		try {
			await resend.emails.send({
				from: 'Grand Luxe <onboarding@resend.dev>',
				to: customerEmail,
				subject: 'Your Booking is Confirmed – Grand Luxe',
				html: `
					<h1>Booking Confirmed ✓</h1>
					<p>Thank you for booking with Grand Luxe.</p>
					<p>Your reservation has been confirmed.</p>
					<p><strong>Check In:</strong> ${session.metadata?.checkIn}</p>
					<p><strong>Check Out:</strong> ${session.metadata?.checkOut}</p>
				`
			});

			console.log('Confirmation email sent');
		} catch (err) {
			console.error('Email failed:', err);
		}
	}

	return { ok: true };
};