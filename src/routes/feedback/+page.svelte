<script>
	let { form } = $props();
</script>

<div class="wrapper">
	<form method="POST" class="card">

		<h2>Guest Feedback</h2>
		<p class="subtitle">We value your experience at Grande Luxe</p>

		<input 
			type="email" 
			name="email" 
			placeholder="Your Email (optional)" 
			class="input"
		/>

		<!-- SERVICE -->
		<div class="section">
			<p>Service</p>
			<div class="rating">
				{#each [5,4,3,2,1] as n}
					<input type="radio" id="service-{n}" name="service" value={n} />
					<label for="service-{n}">★</label>
				{/each}
			</div>
		</div>

		<!-- FOOD -->
		<div class="section">
			<p>Food</p>
			<div class="rating">
				{#each [5,4,3,2,1] as n}
					<input type="radio" id="food-{n}" name="food" value={n} />
					<label for="food-{n}">★</label>
				{/each}
			</div>
		</div>

		<!-- CLEAN -->
		<div class="section">
			<p>Cleanliness</p>
			<div class="rating">
				{#each [5,4,3,2,1] as n}
					<input type="radio" id="clean-{n}" name="cleanliness" value={n} />
					<label for="clean-{n}">★</label>
				{/each}
			</div>
		</div>

		<!-- COMMENT -->
		<textarea 
			name="comments" 
			placeholder="Tell us about your stay (optional)"
			class="textarea"
		></textarea>

		<button type="submit" class="btn">Submit Feedback</button>

	</form>

	{#if form?.message}
		<p class="result">{form.message}</p>
	{/if}
</div>

<style>
.wrapper {
	min-height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	background: linear-gradient(135deg, #000000, #1a1a1a);
	font-family: 'Segoe UI', sans-serif;
}

.card {
	background: rgba(255, 255, 255, 0.08);
	backdrop-filter: blur(12px);
	padding: 30px;
	border-radius: 16px;
	width: 400px;
	display: flex;
	flex-direction: column;
	gap: 18px;
	box-shadow: 0 10px 30px rgba(0,0,0,0.5);
	color: white;
}

h2 {
	text-align: center;
	color: #d4af37;
}

.subtitle {
	text-align: center;
	font-size: 0.9rem;
	color: #ccc;
}

input,
select {
	padding: 12px;
	border-radius: 10px;
	border: 1px solid rgba(255,255,255,.2);
	background: rgba(255,255,255,.08);
	color: white;
	font-size: 15px;
}

select option {
	color: black;
}

.section {
	display: flex;
	flex-direction: column;
	gap: 6px;
}

/* ⭐ STAR RATING */
.rating {
	display: flex;
	flex-direction: row-reverse;
	justify-content: flex-end;
}

.rating input {
	display: none;
}

.rating label {
	font-size: 2rem;
	color: #555;
	cursor: pointer;
	transition: 0.2s;
}

.rating label:hover,
.rating label:hover ~ label {
	color: #d4af37;
}

.rating input:checked ~ label {
	color: #d4af37;
}

/* TEXTAREA */
.textarea {
	padding: 10px;
	border-radius: 8px;
	border: none;
	background: rgba(255,255,255,0.1);
	color: white;
	min-height: 100px;
}

/* BUTTON */


.btn:hover {
	background: #b8962e;
}

.result {
	margin-top: 15px;
	text-align: center;
	color: #00ff99;
	font-weight: bold;
}
</style>