<script>
	import { cart } from '$lib/cart';

	function removeItem(i) {
		cart.update((items) => {
			items.splice(i, 1);
			return [...items];
		});
	}

	async function checkout() {
		const items = $cart;

		const res = await fetch('/checkout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				cart: items
			})
		});

		const data = await res.json();

		if (data.url) {
			window.location.href = data.url;
		} else {
			alert(data.error || 'Checkout failed');
		}
	}

	const roomImages = {
		single: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900',
		double: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=900',
		deluxe: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=900',
		suite: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=900'
	};

	const subtotal = $derived.by(() => {
	return $cart.reduce((sum, item) => sum + item.total, 0);
});

const taxes = $derived.by(() => subtotal * 0.1);

const total = $derived.by(() => subtotal + taxes);
</script>

<div class="container">

	<h1>Your Reservation</h1>

	{#if $cart.length === 0}

		<div class="empty">
			<h2>Your reservation is empty</h2>
			<p>Add a room to begin your luxury stay.</p>

			<a href="/rooms" class="browse-btn">
				Browse Rooms
			</a>
		</div>

	{:else}

		<div class="layout">

			<div>

				{#each $cart as item, i}

					<div class="card">

						<img
							src={roomImages[item.type]}
							alt={item.type}
						/>

						<div class="info">

							<h2>{item.type} Room</h2>

							<p><strong>Room:</strong> {item.roomNumber}</p>

							<p><strong>Guests:</strong> {item.guests}</p>

							<p><strong>Check In:</strong> {item.checkIn}</p>

							<p><strong>Check Out:</strong> {item.checkOut}</p>

							<p><strong>Nights:</strong> {item.nights}</p>

						</div>

						<div class="price">

							<p><strong>Total:</strong> €{item.total}</p>

							<button
								class="remove"
								onclick={() => removeItem(i)}
							>
								Remove
							</button>

						</div>

					</div>

				{/each}

			</div>

			<div class="summary">

				<h2>Booking Summary</h2>

				<div class="row">
					<span>Subtotal</span>
					<span>€{subtotal.toFixed(2)}</span>
				</div>

				<div class="row">
					<span>Taxes (10%)</span>
					<span>€{taxes.toFixed(2)}</span>
				</div>

				<hr>

				<div class="row total">
					<span>Total</span>
					<span>€{total.toFixed(2)}</span>
				</div>

				<button
					class="checkout"
					onclick={checkout}
				>
					Secure Checkout
				</button>

			</div>

		</div>

	{/if}

</div>

<style>

.container{
	max-width:1200px;
	margin:auto;
	padding:40px 20px;
}

h1{
	font-size:42px;
	margin-bottom:40px;
	text-align:center;
}

.layout{
	display:grid;
	grid-template-columns:2fr 1fr;
	gap:30px;
}

.card{
	display:flex;
	background:white;
	border-radius:18px;
	overflow:hidden;
	box-shadow:0 10px 30px rgba(0,0,0,.08);
	margin-bottom:25px;
}

.card img{
	width:260px;
	height:180px;
	object-fit:cover;
}

.info{
	padding:20px;
	flex:1;
}

.info h2{
	margin-top:0;
	color:#0a1628;
}

.price{
	padding:20px;
	display:flex;
	flex-direction:column;
	justify-content:space-between;
	align-items:end;
}

.price h3{
	color:#D4AF37;
	font-size:32px;
	margin:0;
}

.summary{
	background:white;
	padding:30px;
	border-radius:18px;
	box-shadow:0 10px 30px rgba(0,0,0,.08);
	height:fit-content;
	position:sticky;
	top:20px;
}

.row{
	display:flex;
	justify-content:space-between;
	margin:15px 0;
}

.total{
	font-size:22px;
	font-weight:bold;
	color:#D4AF37;
}

.checkout{
	width:100%;
	padding:18px;
	margin-top:30px;
	border:none;
	border-radius:12px;
	background:linear-gradient(90deg,#D4AF37,#FFD95A);
	font-size:18px;
	font-weight:bold;
	cursor:pointer;
	transition:.3s;
}

.checkout:hover{
	transform:translateY(-3px);
	box-shadow:0 10px 30px rgba(212,175,55,.35);
}

.remove{
	background:#d9534f;
	color:white;
	border:none;
	padding:10px 18px;
	border-radius:8px;
	cursor:pointer;
}

.empty{
	text-align:center;
	padding:80px;
}

.browse-btn{
	display:inline-block;
	margin-top:20px;
	padding:14px 28px;
	background:#D4AF37;
	color:black;
	text-decoration:none;
	font-weight:bold;
	border-radius:10px;
}

@media(max-width:900px){

.layout{
	grid-template-columns:1fr;
}

.card{
	flex-direction:column;
}

.card img{
	width:100%;
	height:220px;
}

.price{
	align-items:flex-start;
}

}

</style>