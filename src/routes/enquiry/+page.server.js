import { Resend } from 'resend';
import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { enquiry } from '$lib/server/db/schema';
import { fail } from '@sveltejs/kit';

const resend = new Resend(env.RESEND_API_KEY);

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const guests = data.get('guests')?.toString() ?? '';
		const packageType = data.get('package')?.toString() ?? '';
		const dietary = data.get('dietary')?.toString() ?? '';
		const comments = data.get('comments')?.toString() ?? '';

		if (!guests || !packageType || !dietary) {
			return fail(400, {
				success: false,
				message: 'Please complete all required fields.'
			});
		}

		try {
			await db.insert(enquiry).values({
				guests,
				packageType,
				dietary,
				comments
			});

			await resend.emails.send({
				from: 'Hotel <onboarding@resend.dev>',
				to: 'stefevienna@gmail.com',
				subject: 'New Event Enquiry',
				html: `
					<h1>New Event Enquiry</h1>

					<p><strong>Guests:</strong> ${guests}</p>

					<p><strong>Package:</strong> ${packageType}</p>

					<p><strong>Dietary Requirements:</strong> ${dietary}</p>

					<p><strong>Comments:</strong></p>

					<p>${comments}</p>
				`
			});

			return {
				success: true,
				message: 'Enquiry submitted successfully.'
			};
		} catch (err) {
			console.error('ENQUIRY ERROR:', err);

			return fail(500, {
				success: false,
				message: 'Failed to submit enquiry.'
			});
		}
	}
};