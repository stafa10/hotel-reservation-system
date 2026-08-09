import { fail } from '@sveltejs/kit';
import { Resend } from 'resend';
import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { feedback } from '$lib/server/db/schema';
const resend = new Resend(env.RESEND_API_KEY);

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const email = data.get('email') || 'not provided';
		const service = data.get('service');
		const food = data.get('food');
		const cleanliness = data.get('cleanliness');
		const comments = data.get('comments');

		await db.insert(feedback).values({
			email,
			service,
			food,
			cleanliness,
			comments
		});

		await resend.emails.send({
			from: 'Hotel <onboarding@resend.dev>',
			to: 'muhmmetm040@gmail.com',
			subject: 'Feedback submitted',
			html: `
            <h1> Thanks for the feedback we will take it into consideration </h1>
        `
		});

		return {
			message: 'Feedback submitted'
		};
	}
};
