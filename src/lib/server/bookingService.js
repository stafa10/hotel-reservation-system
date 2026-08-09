import { db } from '$lib/server/db';
import { booking } from '$lib/server/db/schema';

export async function createBooking(data) {

    return await db.insert(booking).values({

        userId: data.userId,

        roomId: data.roomId,

        checkIn: data.checkIn,

        checkOut: data.checkOut

    });

}