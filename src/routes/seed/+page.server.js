import { db } from '$lib/server/db';
import { room } from '$lib/server/db/schema';

export async function load() {

	await db.insert(room).values([
		{
			roomNumber: '101',
			type: 'Single',
			beds: 1,
			price: 120,
			available: 1
		},
		{
			roomNumber: '102',
			type: 'Double',
			beds: 2,
			price: 180,
			available: 1
		},
		{
			roomNumber: '201',
			type: 'Suite',
			beds: 3,
			price: 350,
			available: 1
		}
	]);

	return {};
}