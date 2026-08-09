<script>
	let { data } = $props();
</script>

<h1 class="title">Admin Dashboard</h1>

<h2>Rooms</h2>

<div class="grid">
	{#each data.rooms as room}
		<div class="card">
		<img
	src={
		room.type === 'single'
			? '/single.jpg'
			: room.type === 'double'
				? '/double.jpg'
				: room.type === 'deluxe'
					? '/deluxe.jpg'
					: '/suite.jpg'
	}
	alt={room.type}
	class="room-image"
/>
			<h3>{room.type}</h3>

			<p><strong>Room Number:</strong> {room.roomNumber}</p>

			<p><strong>Beds:</strong> {room.beds}</p>
			<div class="features">

	<div>✓ Free WiFi</div>

	<div>✓ Smart TV</div>

	<div>✓ Air Conditioning</div>

	<div>✓ Breakfast Included</div>

</div>

			<p><strong>Price:</strong> €{room.price}</p>

			<p>
				<strong>Status:</strong>

				{#if room.available}
					<span class="available">Enabled</span>
				{:else}
					<span class="unavailable">Disabled</span>
				{/if}
			</p>

			<form method="POST">
				<input type="hidden" name="roomId" value={room.id} />
				<input type="hidden" name="available" value={room.available} />

				<button formaction="?/toggleRoom">
					{room.available ? 'Disable Room' : 'Enable Room'}
				</button>
			</form>
		</div>
	{/each}
</div>

<hr />

<h2>Bookings</h2>

{#if data.bookings.length === 0}
	<p>No bookings yet</p>
{:else}
	<div class="grid">
		{#each data.bookings as item}
			<div class="card">
				<p><strong>Room:</strong> {item.roomNumber}</p>

				<p><strong>Type:</strong> {item.roomType}</p>

				<p><strong>Guest:</strong> {item.userEmail}</p>

				<p><strong>Check In:</strong> {item.checkIn}</p>

<p><strong>Check Out:</strong> {item.checkOut}</p>
<p><strong>Guests:</strong> {item.guests}</p>

<p><strong>Nights:</strong> {item.nights}</p>

				<form method="POST">
					<input type="hidden" name="bookingId" value={item.id} />

					<button class="danger" formaction="?/deleteBooking">
						Delete Booking
					</button>
				</form>
			</div>
		{/each}
	</div>
{/if}

<hr />

<h2>Feedback</h2>

{#if data.feedbacks.length === 0}
	<p>No feedback submitted</p>
{:else}
	<div class="grid">
		{#each data.feedbacks as item}
			<div class="card">
				<p><strong>Email:</strong> {item.email || 'Not provided'}</p>

				<p><strong>Service:</strong> {item.service}</p>

				<p><strong>Food:</strong> {item.food}</p>

				<p><strong>Cleanliness:</strong> {item.cleanliness}</p>

				<p><strong>Comments:</strong> {item.comments}</p>

				<form method="POST">
					<input type="hidden" name="id" value={item.id} />

					<button class="danger" formaction="?/deleteFeedback">
						Delete Feedback
					</button>
				</form>
			</div>
		{/each}
	</div>
{/if}

<hr />

<h2>Enquiries</h2>

{#if data.enquiries.length === 0}
	<p>No enquiries submitted</p>
{:else}
	<div class="grid">
		{#each data.enquiries as item}
			<div class="card">
				<p><strong>Guests:</strong> {item.guests}</p>

				<p><strong>Package:</strong> {item.packageType}</p>

				<p><strong>Dietary:</strong> {item.dietary}</p>

				<p><strong>Comments:</strong> {item.comments}</p>

				<form method="POST">
					<input type="hidden" name="id" value={item.id} />

					<button class="danger" formaction="?/deleteEnquiry">
						Delete Enquiry
					</button>
				</form>
			</div>
		{/each}
	</div>
{/if}

<style>
	.title {
		text-align: center;
		margin-bottom: 20px;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 20px;
		padding: 20px;
	}

	.room-image{
	width:100%;
	height:220px;
	object-fit:cover;
	border-radius:12px;
	margin-bottom:1rem;
}
	.card {
		background: white;
		padding: 20px;
		border-radius: 12px;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
		color: black;
	}

	.available {
		color: green;
		font-weight: bold;
	}

	.unavailable {
		color: red;
		font-weight: bold;
	}

	button {
		width: 100%;
		padding: 10px;
		margin-top: 12px;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		background: #2563eb;
		color: white;
	}

	.danger {
		background: #dc2626;
	}

	hr {
		margin: 40px 0;
	}
	.room-image{

	width:100%;

	height:220px;

	object-fit:cover;

	border-radius:12px;

	margin-bottom:15px;

	display:block;
}

.card{

	transition:.35s;

	overflow:hidden;
}

.card:hover{

	transform:translateY(-10px);

	box-shadow:0 20px 50px rgba(0,0,0,.18);
}
</style>