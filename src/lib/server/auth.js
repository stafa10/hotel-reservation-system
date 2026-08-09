import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { env } from '$env/dynamic/private';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';
import { Resend } from 'resend';

const resend = new Resend(env.RESEND_API_KEY);

const authInstance = betterAuth({
	baseURL: env.BETTER_AUTH_URL,
	secret: env.BETTER_AUTH_SECRET,

	database: drizzleAdapter(db, {
		provider: 'sqlite'
	}),

	user: {
		additionalFields: {
			role: {
				type: 'string',
				required: false,
				defaultValue: 'user'
			}
		}
	},

	emailAndPassword: {
		enabled: true,
		autoSignIn: false,
		requireEmailVerification: true,

		sendResetPassword: async ({ user, url }) => {
			try {
				console.log('Sending password reset email to:', user.email);

				const result = await resend.emails.send({
					from: 'Grand Luxe <onboarding@resend.dev>',
					to: user.email,
					subject: 'Reset your Grand Luxe password',
					html: `
						<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;">
							<h2 style="color:#0F3D2E;">Reset Password</h2>
							<p>Hello ${user.name},</p>
							<p>Click the button below to reset your password.</p>
							<p style="margin:30px 0;">
								<a href="${url}" style="background:#0F3D2E;color:white;padding:14px 24px;text-decoration:none;border-radius:8px;font-weight:bold;display:inline-block;">
									Reset Password
								</a>
							</p>
							<p>If you didn't request a password reset, simply ignore this email.</p>
							<hr>
							<p style="font-size:12px;color:#777;">Grand Luxe Hotel</p>
						</div>
					`
				});

				console.log('Password reset email result:', result);
			} catch (err) {
				console.error('Password reset email failed:', err);
			}
		}
	},

	emailVerification: {
		sendVerificationEmail: async ({ user, url }) => {
			try {
				console.log('====================================');
				console.log('Sending verification email...');
				console.log('Email:', user.email);
				console.log('Verification URL:', url);
				console.log('====================================');

				const result = await resend.emails.send({
					from: 'Grand Luxe <onboarding@resend.dev>',
					to: user.email,
					subject: 'Verify your Grand Luxe account',
					html: `
						<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;">
							<h2 style="color:#0F3D2E;">Welcome to Grand Luxe Hotel</h2>
							<p>Hello <strong>${user.name}</strong>,</p>
							<p>Thank you for creating your account. Please verify your email address by clicking the button below.</p>
							<p style="margin:30px 0;">
								<a href="${url}" style="background:#0F3D2E;color:white;padding:14px 24px;text-decoration:none;border-radius:8px;font-weight:bold;display:inline-block;">
									Verify Email
								</a>
							</p>
							<p>If the button doesn't work, copy and paste this link into your browser:</p>
							<p style="word-break:break-all;color:#0F3D2E;">${url}</p>
							<hr>
							<p style="font-size:12px;color:#777;">If you didn't create this account, you can safely ignore this email.</p>
							<p style="font-size:12px;color:#777;">Grand Luxe Hotel</p>
						</div>
					`
				});

				console.log('Verification email sent successfully:');
				console.log(result);
			} catch (err) {
				console.error('Verification email failed:');
				console.error(err);
			}
		}
	},

	plugins: [sveltekitCookies(getRequestEvent)]
});

export const auth = authInstance;
export default authInstance;