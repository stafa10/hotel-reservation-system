import { json } from '@sveltejs/kit';
import { stripe } from '$lib/server/stripe.js';
import { db } from '$lib/server/db';
import { booking, room } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { STRIPE_WEBHOOK_SECRET, RESEND_API_KEY } from '$env/static/private';
import { Resend } from 'resend';

const resend = new Resend(RESEND_API_KEY);

export const POST = async ({ request }) => {
	console.log('WEBHOOK HIT');

	const signature = request.headers.get('stripe-signature');
	const rawBody = await request.text();

	let event;

	try {
		event = stripe.webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET);
	} catch (err) {
		console.error('Webhook signature verification failed:', err.message);

		return new Response(`Webhook Error: ${err.message}`, {
			status: 400
		});
	}

	if (event.type === 'checkout.session.completed') {
		const session = event.data.object;

		try {
			console.log('Webhook metadata:', session.metadata);

			const roomId = Number(session.metadata.roomId);

			await db.insert(booking).values({
				roomId,
				userId: session.metadata.userId,
				checkIn: session.metadata.checkIn,
				checkOut: session.metadata.checkOut
			});

			await db.update(room).set({ available: 0 }).where(eq(room.id, roomId));

			console.log('Customer email:', session.customer_details?.email);

			const emailResult = await resend.emails.send({
				from: 'Hotel <onboarding@resend.dev>',
				to: session.customer_details?.email,
				subject: 'Booking Confirmed',
				html: `
		<h1>Booking Confirmed</h1>
		<p>Your reservation has been successfully confirmed.</p>
		<p><strong>Check-in:</strong> ${session.metadata.checkIn}</p>
		<p><strong>Check-out:</strong> ${session.metadata.checkOut}</p>
	`
			});

			console.log('Resend response:');
			console.log(emailResult);

			console.log('Booking saved successfully');
		} catch (err) {
			console.error('Error processing checkout:', err);
		}
	}

	return json({ received: true });
};
