import { db } from '$lib/server/db';
import { room } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function getAvailableRooms() {
    return await db
        .select()
        .from(room)
        .where(eq(room.available, 1));
}