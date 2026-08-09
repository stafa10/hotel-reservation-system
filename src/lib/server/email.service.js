import { Resend } from 'resend';
import { RESEND_API_KEY } from '$env/static/private';

const resend = new Resend(RESEND_API_KEY);

export async function sendOrderConfirmationEmail({ to, orderId, total }) {
  await resend.emails.send({
    from: 'Grand Luxe Hotel <onboarding@resend.dev>',
    to,
    subject: `Enquiry Submitted #${orderId}`,
    html: `
      <h2>Thank you for your Enquiry</h2>
      <p>Your enquiry <strong>#${orderId}</strong> has been received.</p>
      <p>We will contact you withim the next 3-5 working datys.</p>
    `
  });
console.log("Order confirmation email sent to", to);
}
