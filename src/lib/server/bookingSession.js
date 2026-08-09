const sessions = new Map();

export function getSession(userId) {
	if (!sessions.has(userId)) {
		sessions.set(userId, {
			step: null,
			roomType: null,
			roomId: null,
			checkIn: null,
			checkOut: null,
			guests: null,
			name: null,
			email: null,
			phone: null
		});
	}

	return sessions.get(userId);
}

export function clearSession(userId) {
	sessions.delete(userId);
}