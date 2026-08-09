import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql, relations } from 'drizzle-orm';


export const user = sqliteTable('user', {
	id: text().primaryKey(),
	name: text().notNull(),
	email: text().notNull().unique(),
	emailVerified: integer({ mode: 'boolean' }).default(false).notNull(),
	image: text(),
	role: text().notNull().default('user'),
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.$onUpdate(() => new Date())
		.notNull()
});

/** =========================
 * ACCOUNT (Better Auth)
 * ========================= */
export const account = sqliteTable(
	'account',
	{
		id: text().primaryKey(),
		accountId: text('account_id').notNull(),
		providerId: text('provider_id').notNull(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		password: text('password'),
		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
			.$onUpdate(() => new Date())
			.notNull()
	},
	(table) => [index('account_userId_idx').on(table.userId)]
);

/** =========================
 * SESSION (Better Auth)
 * ========================= */
export const session = sqliteTable(
	'session',
	{
		id: text().primaryKey(),
		expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
		token: text('token').notNull().unique(),
		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
			.$onUpdate(() => new Date())
			.notNull(),
		ipAddress: text('ip_address'),
		userAgent: text('user_agent'),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' })
	},
	(table) => [index('session_userId_idx').on(table.userId)]
);

/** =========================
 * VERIFICATION (Better Auth)
 * ========================= */
export const verification = sqliteTable(
	'verification',
	{
		id: text('id').primaryKey(),
		identifier: text('identifier').notNull(),
		value: text('value').notNull(),
		expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.$onUpdate(() => new Date())
			.notNull()
	},
	(table) => [index('verification_identifier_idx').on(table.identifier)]
);

/** =========================
 * ROOM
 * ========================= */
export const room = sqliteTable('room', {
	id: integer().primaryKey({ autoIncrement: true }),
	roomNumber: text().notNull(),
	type: text().notNull().default('single'),
	beds: integer().notNull().default(1),
	price: integer().notNull(),
	image: text(),
	available: integer().notNull().default(1)
});
/** =========================
 * BOOKING
 * ========================= */
export const booking = sqliteTable('booking', {
	id: integer().primaryKey({ autoIncrement: true }),

	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),

	roomId: integer('room_id')
		.notNull()
		.references(() => room.id),

	checkIn: text('check_in').notNull(),
	checkOut: text('check_out').notNull(),

	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull()
});

/** =========================
 * PAYMENT
 * ========================= */
export const payment = sqliteTable('payment', {
	id: integer().primaryKey({ autoIncrement: true }),
	bookingId: integer('booking_id')
		.notNull()
		.references(() => booking.id, { onDelete: 'cascade' }),
	amount: integer().notNull(),
	status: text().notNull().default('pending')
});

export const feedback = sqliteTable('feedback', {
	id: integer().primaryKey({ autoIncrement: true }),
	email: text(),
	service: text(),
	food: text(),
	cleanliness: text(),
	comments: text()
});

export const enquiry = sqliteTable('enquiry', {
	id: integer().primaryKey({ autoIncrement: true }),
	guests: text(),
	packageType: text(),
	dietary: text(),
	comments: text()
});

/** =========================
 * RELATIONS
 * ========================= */
export const userRelations = relations(user, ({ many }) => ({
	bookings: many(booking),
	sessions: many(session),
	accounts: many(account)
}));

export const roomRelations = relations(room, ({ many }) => ({
	bookings: many(booking)
}));

export const bookingRelations = relations(booking, ({ one }) => ({
	user: one(user, {
		fields: [booking.userId],
		references: [user.id]
	}),
	room: one(room, {
		fields: [booking.roomId],
		references: [room.id]
	}),
	payment: one(payment)
}));

export const paymentRelations = relations(payment, ({ one }) => ({
	booking: one(booking, {
		fields: [payment.bookingId],
		references: [booking.id]
	})
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	})
}));

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	})
}));