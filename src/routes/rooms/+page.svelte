<script>
	import { cart } from '$lib/cart';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	let { data } = $props();

	let maxPrice = $state(1000);
let selectedBeds = $state(0);

const filteredRooms = $derived(
	data.rooms.filter((room) => {
		const priceOk = room.price <= maxPrice;
		const bedsOk = selectedBeds === 0 || room.beds === selectedBeds;

		return priceOk && bedsOk;
	})
);

	const checkin = page.url.searchParams.get('checkin') || '';
	const checkout = page.url.searchParams.get('checkout') || '';
	const guests = page.url.searchParams.get('guests') || '';
	const hasSearch = checkin && checkout;

	function calculateNights(start, end) {
		if (!start || !end) return null;
		const diff = new Date(end) - new Date(start);
		return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
	}

	const nights = calculateNights(checkin, checkout);
	let selectedRoom = $state(null);

	const roomImages = {
		single: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
		double: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
		deluxe: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800',
		suite: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'
	};

	function addToCart(room) {
		if (!checkin || !checkout) {
	alert('Please choose your stay dates first.');
	return;
}
		cart.update((items) => [
			...items,
			{
				roomId: room.id,
				roomNumber: room.roomNumber,
				type: room.type,
				beds: room.beds,
				price: room.price,
				checkIn: checkin,
				checkOut: checkout,
				guests,
				nights,
				total: room.price * (nights ?? 1)
			}
		]);
		
		alert(`${room.type} room added to cart ✓`);
	}
	function viewDetails(room) {
	goto(`/rooms/${room.id}?checkin=${checkin}&checkout=${checkout}&guests=${guests}`);
}
</script>

<svelte:head>
	<title>Available Rooms — Grand Luxe</title>
</svelte:head>

<div class="rooms-page">
	<!-- Search summary bar -->
	<div class="summary-bar">
		<div class="summary-inner">
			<div class="summary-left">
				<h1>
					{checkin && checkout ? 'Available Rooms' : 'All Rooms'}
				</h1>
				{#if checkin && checkout}
					<p class="summary-sub">
						{data.rooms.length} room{data.rooms.length !== 1 ? 's' : ''} available for your dates
					</p>
				{/if}
			</div>
			<div class="summary-chips">
				{#if checkin}
					<div class="chip">
						<span class="chip-label">Check-in</span>
						<span class="chip-val">{checkin}</span>
					</div>
				{/if}
				{#if checkout}
					<div class="chip">
						<span class="chip-label">Check-out</span>
						<span class="chip-val">{checkout}</span>
					</div>
				{/if}
				{#if guests}
					<div class="chip">
						<span class="chip-label">Guests</span>
						<span class="chip-val">{guests}</span>
					</div>
				{/if}
				{#if nights}
					<div class="chip gold">
						<span class="chip-label">Nights</span>
						<span class="chip-val">{nights}</span>
					</div>
				{/if}
				<a href="/booking" class="change-btn">Change Dates</a>
			</div>
		</div>
	</div>

	<div class="page-inner">
	<div class="filters">

	<h3>Filter Rooms</h3>

	<div class="filter-group">

		<label>Maximum Price (€{maxPrice})</label>

		<input
			type="range"
			min="100"
			max="500"
			step="10"
			bind:value={maxPrice}
		/>

	</div>

	<div class="filter-group">

		<label>Beds</label>

		<select bind:value={selectedBeds}>
			<option value={0}>All</option>
			<option value={1}>1 Bed</option>
			<option value={2}>2 Beds</option>
			<option value={3}>3 Beds</option>
		</select>

	</div>

</div>
		 {#if !hasSearch}

<div class="empty-state">
	<h2>Select your stay dates first</h2>
	<p>Please choose your check-in and check-out dates before viewing available rooms.</p>

	<a href="/booking" class="btn-gold">
		Book Your Stay
	</a>
</div>

{:else if data.rooms.length === 0}
			<div class="empty-state">
				<span class="empty-icon">🏨</span>
				<h2>No rooms available</h2>
				<p>Try different dates or contact us directly for assistance.</p>
				<a href="/booking" class="btn-gold">Change Dates</a>
			</div>
		{:else}
			<div class="rooms-grid">
				{#each filteredRooms as room}
					<article class="room-card">
						<div class="room-img-wrap">
							<img src={roomImages[room.type] ?? roomImages.suite} alt="{room.type} room" />
							<div class="room-type-badge">{room.type}</div>
						</div>

						<div class="room-body">
							<div class="room-top">
								<div>
									<h3>{room.type.charAt(0).toUpperCase() + room.type.slice(1)} Room</h3>
									<p class="room-number">Room {room.roomNumber}</p>
								</div>
								<div class="price-block">
									<span class="price">€{room.price}</span>
									<span class="per-night">/ night</span>
								</div>
							</div>

							<p class="room-description">
								{#if room.type === 'single'}
									A stylish room perfect for solo travellers looking for comfort and elegance.
								{:else if room.type === 'double'}
									A spacious room ideal for couples or business guests.
								{:else if room.type === 'deluxe'}
									Enjoy extra luxury with premium furnishings and panoramic views.
								{:else}
									Our most luxurious accommodation featuring a separate living area and premium
									amenities.
								{/if}
							</p>

							<div class="room-meta">
								<span
									><i class="bi bi-people-fill"></i> {room.beds} Bed{room.beds > 1 ? 's' : ''}</span
								>
								<span
									><i class="bi bi-aspect-ratio"></i>
									{room.type === 'suite'
										? '80'
										: room.type === 'deluxe'
											? '45'
											: room.type === 'double'
												? '32'
												: '24'} m²</span
								>
							</div>

							<div class="amenities">
								<span class="amenity">✓ Free WiFi</span>
								<span class="amenity">✓ Smart TV</span>
								<span class="amenity">✓ Air Con</span>
								<span class="amenity">✓ Breakfast</span>
							</div>

							{#if nights}
								<div class="total-strip">
									<span>{nights} night{nights > 1 ? 's' : ''} total</span>
									<strong>€{room.price * nights}</strong>
								</div>
							{/if}

							<div class="button-group">

	<button
	class="details-btn"
	onclick={() => viewDetails(room)}
>
	View Details
</button>

	<button
		class="book-btn"
		disabled={!room.available}
		onclick={() => addToCart(room)}
	>
		Book Now
	</button>

</div>
						</div>
					</article>
				{/each}
			</div>
		{/if}
	</div>
{#if selectedRoom}

<div class="modal-overlay" onclick={() => selectedRoom = null}>

	<div
		class="modal"
		onclick={(e) => e.stopPropagation()}
	>

		<img
			src={roomImages[selectedRoom.type]}
			alt={selectedRoom.type}
			class="modal-image"
		/>

		<h2>
			{selectedRoom.type.charAt(0).toUpperCase() + selectedRoom.type.slice(1)}
			Room
		</h2>

		<p>
			Perfect for a luxurious and comfortable stay.
		</p>

		<ul>

			<li>✓ Free WiFi</li>

			<li>✓ Smart TV</li>

			<li>✓ Air Conditioning</li>

			<li>✓ Luxury Bathroom</li>

			<li>✓ Complimentary Breakfast</li>

			<li>✓ Daily Housekeeping</li>

		</ul>

		<button
			class="book-btn"
			onclick={() => {
				addToCart(selectedRoom);
				selectedRoom = null;
			}}
		>
			Reserve This Room
		</button>

	</div>

</div>

{/if}	
</div>

<style>
	:global(body) {
		margin: 0;
		font-family: 'Inter', system-ui, sans-serif;
		background: #faf9f7;
	}
	:global(h1, h2, h3) {
		font-family: 'Cormorant Garamond', Georgia, serif;
	}

	.rooms-page {
		min-height: 100vh;
	}

	/* Summary bar */
	.summary-bar {
		background: #0a1628;
		padding: 1.5rem 2rem;
		border-bottom: 1px solid rgba(212, 175, 55, 0.2);
	}
	.summary-inner {
		max-width: 1280px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 1rem;
	}
	.summary-left h1 {
		font-size: 1.8rem;
		color: white;
		margin: 0;
	}
	.summary-sub {
		color: rgba(255, 255, 255, 0.45);
		font-size: 0.82rem;
		margin: 0.2rem 0 0;
	}
	.summary-chips {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
	}
	.chip {
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 6px;
		padding: 0.45rem 0.9rem;
		text-align: center;
	}
	.chip.gold {
		border-color: rgba(212, 175, 55, 0.4);
		background: rgba(212, 175, 55, 0.08);
	}
	.chip-label {
		display: block;
		font-size: 0.62rem;
		text-transform: uppercase;
		letter-spacing: 1px;
		color: rgba(255, 255, 255, 0.4);
	}
	.chip-val {
		font-size: 0.85rem;
		font-weight: 600;
		color: white;
	}
	.chip.gold .chip-val {
		color: #d4af37;
	}
	.change-btn {
		padding: 0.5rem 1.1rem;
		border: 1px solid rgba(212, 175, 55, 0.5);
		color: #d4af37;
		border-radius: 6px;
		font-size: 0.82rem;
		font-weight: 600;
		text-decoration: none;
		transition: 0.2s;
	}
	.change-btn:hover {
		background: rgba(212, 175, 55, 0.1);
	}

	/* Page inner */
	.page-inner {
		max-width: 1280px;
		margin: 0 auto;
		padding: 2.5rem 2rem;
	}

	/* Empty */
	.empty-state {
		text-align: center;
		padding: 5rem 2rem;
		background: white;
		border-radius: 12px;
		max-width: 480px;
		margin: 0 auto;
	}
	.empty-icon {
		font-size: 3rem;
		display: block;
		margin-bottom: 1rem;
	}
	.empty-state h2 {
		font-size: 2rem;
		margin: 0 0 0.5rem;
		color: #0a1628;
	}
	.empty-state p {
		color: #888;
		margin: 0 0 1.5rem;
	}
	.btn-gold {
		display: inline-block;
		padding: 0.8rem 2rem;
		background: linear-gradient(90deg, #d4af37, #ffd95a);
		color: #000;
		font-weight: 700;
		font-size: 0.85rem;
		letter-spacing: 0.5px;
		border-radius: 6px;
		text-decoration: none;
		text-transform: uppercase;
		transition: 0.3s;
	}
	.btn-gold:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 20px rgba(212, 175, 55, 0.35);
	}

	/* Grid */
	.rooms-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 1.5rem;
	}

	/* Room card */
	.room-card {
		background: white;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
		border: 1px solid #f0ece3;
		transition: 0.3s;
	}
	.room-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
	}
	.room-img-wrap {
		position: relative;
		overflow: hidden;
	}
	.room-img-wrap img {
		width: 100%;
		height: 220px;
		object-fit: cover;
		display: block;
		transition: 0.4s;
	}
	.room-card:hover .room-img-wrap img {
		transform: scale(1.04);
	}
	.room-type-badge {
		position: absolute;

		top: 18px;

		left: 18px;

		background: rgba(10, 22, 40, 0.92);

		color: #d4af37;

		padding: 8px 16px;

		font-size: 12px;

		font-weight: 700;

		letter-spacing: 2px;

		border-radius: 40px;

		text-transform: uppercase;
	}
	.room-body {
		padding: 1.4rem;
	}
	.room-top {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 0.75rem;
	}
	.room-top h3 {
		font-size: 1.4rem;
		margin: 0;
		color: #0a1628;
		font-weight: 600;
	}
	.room-number {
		font-size: 0.78rem;
		color: #aaa;
		margin: 0.2rem 0 0;
	}
	.room-description {
		font-size: 0.88rem;

		color: #666;

		line-height: 1.6;

		margin: 1rem 0;
	}
	.price-block {
		text-align: right;
	}
	.price {
		font-family: 'Cormorant Garamond', serif;
		font-size: 1.8rem;
		font-weight: 700;
		color: #0a1628;
		line-height: 1;
	}
	.per-night {
		display: block;
		font-size: 0.72rem;
		color: #aaa;
	}
	.room-meta {
		display: flex;
		gap: 1rem;
		margin-bottom: 0.9rem;
	}
	.room-meta span {
		font-size: 0.8rem;
		color: #666;
		display: flex;
		align-items: center;
		gap: 0.3rem;
	}
	.amenities {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.3rem 0.5rem;
		margin-bottom: 1rem;
	}
	.amenity {
		font-size: 0.78rem;
		color: #555;
	}
	.total-strip {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #f0ece3;
		border-radius: 6px;
		padding: 0.6rem 0.9rem;
		margin-bottom: 1rem;
		font-size: 0.85rem;
		color: #666;
	}
	.total-strip strong {
		font-size: 1.1rem;
		color: #0a1628;
		font-family: 'Cormorant Garamond', serif;
	}
	.book-btn {
		width: 100%;
		padding: 0.85rem;
		background: linear-gradient(90deg, #d4af37, #ffd95a);
		color: #000;
		font-weight: 700;
		font-size: 0.85rem;
		letter-spacing: 1px;
		text-transform: uppercase;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		transition: 0.3s;
	}
	.book-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 20px rgba(212, 175, 55, 0.35);
	}
    .button-group{
	display:flex;
	gap:10px;
	margin-top:20px;
}

.details-btn{
	flex:1;
	padding:14px;
	border:2px solid #D4AF37;
	background:white;
	color:#D4AF37;
	border-radius:8px;
	font-weight:bold;
	cursor:pointer;
	transition:.3s;
}

.details-btn:hover{
	background:#D4AF37;
	color:white;
}

.book-btn{
	flex:1;
}

.modal-overlay{
	position:fixed;
	inset:0;
	background:rgba(0,0,0,.7);
	display:flex;
	justify-content:center;
	align-items:center;
	z-index:999;
}

.modal{
	background:white;
	width:700px;
	max-width:95%;
	border-radius:18px;
	overflow:hidden;
	padding-bottom:20px;
	animation:pop .3s ease;
}

.modal-image{
	width:100%;
	height:300px;
	object-fit:cover;
}

.modal h2{
	margin:20px;
}

.modal p{
	margin:0 20px;
	color:#666;
}

.modal ul{
	margin:20px;
	line-height:2;
}

.modal button{
	margin:20px;
	width:calc(100% - 40px);
}

.filters{
	background:white;
	padding:24px;
	border-radius:14px;
	margin-bottom:30px;
	box-shadow:0 10px 25px rgba(0,0,0,.06);
	display:flex;
	flex-wrap:wrap;
	gap:30px;
	align-items:flex-end;
}

.filters h3{
	width:100%;
	margin:0;
	font-size:28px;
	color:#0A1628;
}

.filter-group{
	display:flex;
	flex-direction:column;
	min-width:220px;
}

.filter-group label{
	margin-bottom:8px;
	font-weight:600;
	color:#444;
}

.filter-group input,
.filter-group select{
	padding:10px;
	border:1px solid #ddd;
	border-radius:8px;
	font-size:15px;
}
@keyframes pop{

	from{
		transform:scale(.9);
		opacity:0;
	}

	to{
		transform:scale(1);
		opacity:1;
	}

}
	
	@media (max-width: 600px) {
		.rooms-grid {
			grid-template-columns: 1fr;
		}
		.summary-inner {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
