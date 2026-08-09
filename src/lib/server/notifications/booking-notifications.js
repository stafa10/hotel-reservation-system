import { sendOrderConfirmationEmail } from '../email/email-service.js';

export async function notifyEnquiryCreated({ enquiry, user }) {
  await sendOrderConfirmationEmail({
    to: user.email,
    bookingId: booking.id,
  });
}
