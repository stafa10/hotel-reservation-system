import { db } from '$lib/server/db';
import { getSession, clearSession } from '$lib/server/bookingSession';
import { room, booking } from '$lib/server/db/schema';
import { eq, and, lt, gt } from 'drizzle-orm';
import { OPENAI_API_KEY } from '$env/static/private';
import { auth } from '$lib/server/auth';

function json(reply, status = 200) {
	return new Response(JSON.stringify({ reply }), {
		status,
		headers: {
			'Content-Type': 'application/json'
		}
	});
}

/**
 * Convert common user date expressions into YYYY-MM-DD.
 */
function parseDate(input) {
	const value = input.trim().toLowerCase();

	const now = new Date();

	if (
		value.includes('tomorrow') ||
		value.includes('tomorow') ||
		value.includes('tomoorow')
	) {
		const date = new Date(now);
		date.setDate(date.getDate() + 1);

		return date.toISOString().split('T')[0];
	}

	if (value.includes('today')) {
		return now.toISOString().split('T')[0];
	}

	// Examples:
	// 15 July
	// 15 July 2026
	// 15th July
	// July 15
	// July 15 2026

	const cleaned = value
		.replace(/(\d+)(st|nd|rd|th)/g, '$1')
		.replace(/,/g, '');

	const months = {
		january: 0,
		february: 1,
		march: 2,
		april: 3,
		may: 4,
		june: 5,
		july: 6,
		august: 7,
		september: 8,
		october: 9,
		november: 10,
		december: 11
	};

	let match = cleaned.match(
		/^(\d{1,2})\s+([a-z]+)(?:\s+(\d{4}))?$/
	);

	if (match) {
		const day = Number(match[1]);
		const monthName = match[2];
		const year = Number(match[3]) || now.getFullYear();

		if (months[monthName] !== undefined) {
			const date = new Date(
				year,
				months[monthName],
				day
			);

			return date.toISOString().split('T')[0];
		}
	}

	match = cleaned.match(
		/^([a-z]+)\s+(\d{1,2})(?:\s+(\d{4}))?$/
	);

	if (match) {
		const monthName = match[1];
		const day = Number(match[2]);
		const year = Number(match[3]) || now.getFullYear();

		if (months[monthName] !== undefined) {
			const date = new Date(
				year,
				months[monthName],
				day
			);

			return date.toISOString().split('T')[0];
		}
	}

	return null;
}

/**
 * Get the next day.
 */
function getNextDay(dateString) {
	const date = new Date(`${dateString}T00:00:00`);
	date.setDate(date.getDate() + 1);

	return date.toISOString().split('T')[0];
}

/**
 * Find a room of the requested type that is not already
 * booked for the requested dates.
 */
async function findAvailableRoom(roomType, checkIn, checkOut) {
	const rooms = await db
		.select()
		.from(room)
		.where(eq(room.type, roomType));

	for (const candidate of rooms) {
		const conflictingBookings = await db
			.select()
			.from(booking)
			.where(
				and(
					eq(booking.roomId, candidate.id),

					// Existing booking starts before requested checkout
					lt(booking.checkIn, checkOut),

					// Existing booking ends after requested check-in
					gt(booking.checkOut, checkIn)
				)
			)
			.limit(1);

		if (conflictingBookings.length === 0) {
			return candidate;
		}
	}

	return null;
}

export async function POST({ request }) {
	try {
		const { message } = await request.json();

		if (!message || typeof message !== 'string') {
			return json('Please enter a message.');
		}

		//--------------------------------------------------
		// AUTHENTICATION
		//--------------------------------------------------

		const authSession = await auth.api.getSession({
			headers: request.headers
		});

		if (!authSession?.user) {
			return json(
				'Please log in to make a room reservation.',
				401
			);
		}

		const userId = authSession.user.id;

		const session = getSession(userId);

		const lower = message.trim().toLowerCase();

		console.log('--------------------------------');
		console.log('USER:', authSession.user.email);
		console.log('MESSAGE:', message);
		console.log('BOOKING SESSION:', session);
		console.log('--------------------------------');

		//--------------------------------------------------
		// CANCEL CURRENT BOOKING
		//--------------------------------------------------

		if (
			lower === 'cancel' ||
			lower === 'no' ||
			lower.includes('cancel booking')
		) {
			clearSession(userId);

			return json(
				'Your booking process has been cancelled. If you need anything else, I am happy to help.'
			);
		}

		//--------------------------------------------------
		// STEP 1 — START BOOKING
		//--------------------------------------------------

		if (
			session.step === null &&
			(
				lower.includes('book') ||
				lower.includes('reserve')
			) &&
			(
				lower.includes('room') ||
				lower.includes('hotel') ||
				lower.includes('suite')
			)
		) {
			const rooms = await db
				.select()
				.from(room);

			if (rooms.length === 0) {
				return json(
					'Unfortunately, there are currently no rooms in our system.'
				);
			}

			session.step = 'roomType';

			const roomTypes = [
				...new Set(rooms.map((r) => r.type))
			];

			const roomList = roomTypes
				.map((type) => {
					const example = rooms.find(
						(r) => r.type === type
					);

					return `• ${type} (€${example.price}/night)`;
				})
				.join('\n');

			return json(
				`I would be delighted to help with your reservation.\n\nAvailable room types:\n\n${roomList}\n\nWhich room would you like?`
			);
		}

		//--------------------------------------------------
		// STEP 2 — ROOM TYPE
		//--------------------------------------------------

		if (session.step === 'roomType') {
			let selectedType = null;

			if (lower.includes('deluxe')) {
				selectedType = 'deluxe';
			} else if (lower.includes('executive')) {
				selectedType = 'executive';
			} else if (lower.includes('presidential')) {
				selectedType = 'presidential';
			} else if (lower.includes('single')) {
				selectedType = 'single';
			} else if (lower.includes('double')) {
				selectedType = 'double';
			} else if (lower.includes('suite')) {
				selectedType = 'suite';
			}

			if (!selectedType) {
				return json(
					'Please choose one of the available room types.'
				);
			}

			const matchingRooms = await db
				.select()
				.from(room)
				.where(eq(room.type, selectedType));

			if (matchingRooms.length === 0) {
				return json(
					`I'm sorry, we don't currently have a ${selectedType} room in our system. Please choose another room type.`
				);
			}

			session.roomType = selectedType;
			session.step = 'checkIn';

			return json(
				`Excellent choice! What is your check-in date?\n\nFor example: tomorrow, 15 July, or 15 July 2026.`
			);
		}

		//--------------------------------------------------
		// STEP 3 — CHECK-IN
		//--------------------------------------------------

		if (session.step === 'checkIn') {
			const checkIn = parseDate(message);

			if (!checkIn) {
				return json(
					"I couldn't understand that date. Please enter it like 'tomorrow', '15 July', or '15 July 2026'."
				);
			}

			session.checkIn = checkIn;
			session.checkOut = getNextDay(checkIn);

			session.step = 'guests';

			return json(
				`Great. Your check-in date is ${checkIn}.\n\nHow many guests will be staying?`
			);
		}

		//--------------------------------------------------
		// STEP 4 — GUESTS
		//--------------------------------------------------

		if (session.step === 'guests') {
			const guests = Number.parseInt(message.trim(), 10);

			if (
				Number.isNaN(guests) ||
				guests <= 0 ||
				guests > 20
			) {
				return json(
					'Please enter a valid number of guests.'
				);
			}

			session.guests = guests;
			session.step = 'name';

			return json(
				'Thank you. May I have the full name for the booking?'
			);
		}

		//--------------------------------------------------
		// STEP 5 — NAME
		//--------------------------------------------------

		if (session.step === 'name') {
			if (message.trim().length < 2) {
				return json(
					'Please enter the guest name for the reservation.'
				);
			}

			session.name = message.trim();
			session.step = 'email';

			return json(
				'Thank you. What email address should we use for the reservation?'
			);
		}

		//--------------------------------------------------
		// STEP 6 — EMAIL
		//--------------------------------------------------

		if (session.step === 'email') {
			const email = message.trim();

			const validEmail =
				/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

			if (!validEmail) {
				return json(
					'Please enter a valid email address.'
				);
			}

			session.email = email;
			session.step = 'phone';

			return json(
				'Thank you. Finally, may I have your phone number?'
			);
		}

		//--------------------------------------------------
		// STEP 7 — PHONE
		//--------------------------------------------------

		if (session.step === 'phone') {
			const phone = message.trim();

			if (phone.length < 7) {
				return json(
					'Please enter a valid phone number.'
				);
			}

			session.phone = phone;
			session.step = 'confirm';

			return json(
				`Please confirm your booking:\n\nRoom: ${session.roomType}\nCheck-in: ${session.checkIn}\nCheck-out: ${session.checkOut}\nGuests: ${session.guests}\nName: ${session.name}\nEmail: ${session.email}\nPhone: ${session.phone}\n\nReply YES to confirm or NO to cancel.`
			);
		}

		//--------------------------------------------------
		// STEP 8 — CONFIRMATION
		//--------------------------------------------------

		if (session.step === 'confirm') {
			if (lower !== 'yes') {
				clearSession(userId);

				return json(
					'Your booking has been cancelled.'
				);
			}

			//--------------------------------------------------
			// CHECK REAL ROOM AVAILABILITY
			//--------------------------------------------------

			const selectedRoom = await findAvailableRoom(
				session.roomType,
				session.checkIn,
				session.checkOut
			);

			if (!selectedRoom) {
				clearSession(userId);

				return json(
					`I'm sorry, the ${session.roomType} is no longer available for ${session.checkIn}. Please choose another date or room type.`
				);
			}

			//--------------------------------------------------
			// CREATE REAL DATABASE BOOKING
			//--------------------------------------------------

			const newBooking = await db
				.insert(booking)
				.values({
					userId: userId,
					roomId: selectedRoom.id,
					checkIn: session.checkIn,
					checkOut: session.checkOut,
					guests: session.guests,
					guestName: session.name,
					guestEmail: session.email,
					guestPhone: session.phone,
					status: 'confirmed'
				})
				.returning();

			const bookingId = newBooking[0].id;

			const bookingReference =
				'GL-' +
				bookingId.toString().padStart(5, '0');

			clearSession(userId);

			return json(
				`🎉 Your booking has been confirmed!\n\nBooking Reference: ${bookingReference}\n\nGuest: ${session.name}\nRoom: ${session.roomType}\nCheck-in: ${session.checkIn}\nCheck-out: ${session.checkOut}\nGuests: ${session.guests}\n\nThank you for choosing Grand Luxe Hotel. We look forward to welcoming you!`
			);
		}

		//--------------------------------------------------
		// OPENAI — NORMAL HOTEL QUESTIONS
		//--------------------------------------------------

		const response = await fetch(
			'https://api.openai.com/v1/chat/completions',
			{
				method: 'POST',

				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${OPENAI_API_KEY}`
				},

				body: JSON.stringify({
					model: 'gpt-4.1-mini',

					messages: [
						{
							role: 'system',

							content: `
You are the AI Concierge for Grand Luxe Hotel in Dublin.

You are friendly, professional, concise and welcoming.

IMPORTANT:
- You answer general hotel questions.
- You must NEVER claim that a booking was made unless the hotel booking system has actually created one.
- You must NEVER invent hotel facilities or policies.
- If information is not provided below, say that reception can provide the information.

Hotel:

Name: Grand Luxe Hotel
Location: Dublin City Centre

Check-in: 3:00 PM
Check-out: 11:00 AM
Reception: 24 hours

Facilities:
- Luxury Spa
- Indoor Swimming Pool
- Fitness Centre
- Michelin-style Restaurant
- Cocktail Bar
- Free High-Speed WiFi
- Concierge Service
- Room Service
- Airport Transfers
- Sauna

Rooms:
- Deluxe Room
- Executive Suite
- Presidential Suite
- Single Room
- Double Room

Parking:
Private secure parking available.

Pets:
Pets are not allowed.

Breakfast:
7:00 AM - 10:30 AM daily.

Towels:
Towels are provided in guest rooms.

For booking requests, the application handles the booking process separately. Do not pretend to make a reservation yourself.
`
						},
						{
							role: 'user',
							content: message
						}
					],

					max_completion_tokens: 300
				})
			}
		);

		const data = await response.json();

		if (!response.ok) {
			throw new Error(
				data.error?.message ||
					'OpenAI request failed'
			);
		}

		const reply =
			data.choices?.[0]?.message?.content?.trim() ||
			"I'm sorry, I couldn't generate a response.";

		return json(reply);

	} catch (error) {
		console.error('🔥 CHAT API ERROR:', error);

		return json(
			'Something went wrong while processing your request. Please try again.',
			500
		);
	}
}