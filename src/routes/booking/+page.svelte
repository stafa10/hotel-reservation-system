<script>
	import { goto } from '$app/navigation';

	let today = new Date().toISOString().split('T')[0];

	let checkin = $state('');
	let checkout = $state('');
	let guests = $state('2');
	let name = $state('');
	let phone = $state('');
	let email = $state('');

	$effect(() => {
		if (checkin) {
			const d = new Date(checkin);
			d.setDate(d.getDate() + 1);
			checkout = d.toISOString().split('T')[0];
		}
	});

	let isValid = $derived(checkin && checkout && guests && name && email && phone.length >= 7);

	function onlyNumbers(event) {
		phone = event.target.value.replace(/[^0-9+]/g, '');
		event.target.value = phone;
	}

	function goToRooms(e) {
		e.preventDefault();
		if (phone.length < 7) {
			alert('Please enter a valid phone number.');
			return;
		}
		goto(`/rooms?checkin=${checkin}&checkout=${checkout}&guests=${guests}`);
	}
</script>

<svelte:head>
	<title>Book Your Stay — Grand Luxe</title>
</svelte:head>

<div class="booking-page">

	<!-- Left: Info panel -->
	<div class="info-panel">
		<p class="eyebrow">Grand Luxe Hotel</p>
		<h1>Reserve Your Suite</h1>
		<p class="info-sub">Fill in your details and we'll show you available rooms for your dates.</p>

		<div class="info-features">
			<div class="info-feature">
				<span class="feat-icon">✓</span>
				<span>Best rate guaranteed</span>
			</div>
			<div class="info-feature">
				<span class="feat-icon">✓</span>
				<span>Free cancellation up to 48h</span>
			</div>
			<div class="info-feature">
				<span class="feat-icon">✓</span>
				<span>Instant confirmation</span>
			</div>
			<div class="info-feature">
				<span class="feat-icon">✓</span>
				<span>24/7 concierge support</span>
			</div>
		</div>

		<img
			src="https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800"
			alt="Luxury Suite"
			class="info-img"
		/>
	</div>

	<!-- Right: Form -->
	<div class="form-panel">
		<div class="form-card">
			<h2>Your Details</h2>
			<p class="form-sub">We'll use these to confirm your reservation.</p>

			<form onsubmit={goToRooms}>
				<div class="field-row">
					<div class="field">
						<label for="name">Full Name</label>
						<input id="name" type="text" bind:value={name} placeholder="e.g. John Smith" required />
					</div>
					<div class="field">
						<label for="email">Email Address</label>
						<input id="email" type="email" bind:value={email} placeholder="you@email.com" required />
					</div>
				</div>

				<div class="field">
					<label for="phone">Phone Number</label>
					<input id="phone" type="tel" bind:value={phone} oninput={onlyNumbers} placeholder="+353 87 123 4567" required />
				</div>

				<div class="divider"><span>Stay Details</span></div>

				<div class="field-row">
					<div class="field">
						<label for="checkin">Check-in Date</label>
						<input id="checkin" type="date" bind:value={checkin} min={today} required />
					</div>
					<div class="field">
						<label for="checkout">Check-out Date</label>
						<input id="checkout" type="date" bind:value={checkout} min={checkin || today} required />
					</div>
				</div>

				<div class="field">
					<label for="guests">Number of Guests</label>
					<select id="guests" bind:value={guests}>
						<option value="1">1 Guest</option>
						<option value="2">2 Guests</option>
						<option value="3">3 Guests</option>
						<!-- <option value="4">4 Guests</option>
						<option value="5">5 Guests</option> -->
					</select>
				</div>

				{#if checkin && checkout}
					<div class="summary-strip">
						<div class="summary-item">
							<span class="s-label">Check-in</span>
							<span class="s-val">{checkin}</span>
						</div>
						<div class="s-divider"></div>
						<div class="summary-item">
							<span class="s-label">Check-out</span>
							<span class="s-val">{checkout}</span>
						</div>
						<div class="s-divider"></div>
						<div class="summary-item">
							<span class="s-label">Guests</span>
							<span class="s-val">{guests}</span>
						</div>
					</div>
				{/if}

				<button type="submit" class="submit-btn" disabled={!isValid}>
					Search Available Rooms →
				</button>
			</form>
		</div>
	</div>

</div>

<style>
	:global(body) { margin: 0; font-family: 'Inter', system-ui, sans-serif; background: #faf9f7; }
	:global(h1,h2,h3) { font-family: 'Cormorant Garamond', Georgia, serif; }

	.booking-page {
		display: grid;
		grid-template-columns: 1fr 1fr;
		min-height: calc(100vh - 64px);
	}

	/* Left panel */
	.info-panel {
		background: #0a1628;
		padding: 4rem 3rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		color: white;
	}
	.eyebrow {
		font-size: 0.72rem;
		letter-spacing: 4px;
		text-transform: uppercase;
		color: #D4AF37;
		margin: 0 0 1rem;
	}
	.info-panel h1 {
		font-size: clamp(2.2rem, 4vw, 3.2rem);
		margin: 0 0 1rem;
		color: white;
		font-weight: 600;
		line-height: 1.1;
	}
	.info-sub {
		color: rgba(255,255,255,0.55);
		font-size: 0.95rem;
		line-height: 1.7;
		margin: 0 0 2rem;
	}
	.info-features { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2.5rem; }
	.info-feature { display: flex; align-items: center; gap: 0.75rem; font-size: 0.88rem; color: rgba(255,255,255,0.75); }
	.feat-icon { color: #D4AF37; font-weight: 700; font-size: 0.9rem; }
	.info-img { width: 100%; border-radius: 8px; height: 220px; object-fit: cover; opacity: 0.7; }

	/* Right panel */
	.form-panel {
		background: #faf9f7;
		padding: 4rem 3rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.form-card { width: 100%; max-width: 480px; }
	.form-card h2 { font-size: 2rem; margin: 0 0 0.3rem; color: #0a1628; }
	.form-sub { color: #888; font-size: 0.88rem; margin: 0 0 2rem; }

	/* Fields */
	.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
	.field { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1rem; }
	label { font-size: 0.8rem; font-weight: 600; color: #333; letter-spacing: 0.3px; }
	input, select {
		padding: 0.75rem 1rem;
		border: 1px solid #e2e0db;
		border-radius: 6px;
		background: white;
		font-size: 0.92rem;
		color: #1a1a1a;
		transition: 0.2s;
		font-family: inherit;
	}
	input:focus, select:focus { outline: none; border-color: #D4AF37; box-shadow: 0 0 0 3px rgba(212,175,55,0.12); }
	input::placeholder { color: #bbb; }

	/* Divider */
	.divider {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin: 0.5rem 0 1rem;
		color: #aaa;
		font-size: 0.75rem;
		letter-spacing: 1px;
		text-transform: uppercase;
	}
	.divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: #e2e0db; }

	/* Summary strip */
	.summary-strip {
		display: flex;
		align-items: center;
		background: #f0ece3;
		border-radius: 8px;
		padding: 1rem 1.5rem;
		margin-bottom: 1.5rem;
		gap: 0;
	}
	.summary-item { flex: 1; text-align: center; }
	.s-label { display: block; font-size: 0.68rem; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 0.3rem; }
	.s-val { font-size: 0.88rem; font-weight: 600; color: #0a1628; }
	.s-divider { width: 1px; height: 32px; background: #d5d0c8; }

	/* Submit */
	.submit-btn {
		width: 100%;
		padding: 1rem;
		background: linear-gradient(90deg, #D4AF37, #FFD95A);
		color: #000;
		font-weight: 700;
		font-size: 0.9rem;
		letter-spacing: 0.5px;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		transition: 0.3s;
		text-transform: uppercase;
	}
	.submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(212,175,55,0.35); }
	.submit-btn:disabled { opacity: 0.45; cursor: not-allowed; }

	@media (max-width: 900px) {
		.booking-page { grid-template-columns: 1fr; }
		.info-panel { padding: 3rem 2rem; }
		.form-panel { padding: 3rem 2rem; }
		.field-row { grid-template-columns: 1fr; }
	}
</style>