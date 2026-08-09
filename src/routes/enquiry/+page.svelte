<script>
	import { enhance } from '$app/forms';

	let { form } = $props();
</script>

<form
	method="POST"
	use:enhance={({ formElement }) => {
		return async ({ result, update }) => {
			await update();

			if (result.type === 'success') {
				formElement.reset();
			}
		};
	}}
>
	<div class="container">
		<div class="feedback-card">
			<h2>Hotel Event Enquiry Form</h2>

			<div class="question">
				<p>How many guests attending?</p>

				<label>
					<input type="radio" name="guests" value="Less than 50" required />
					Less than 50
				</label>

				<label>
					<input type="radio" name="guests" value="Less than 100" />
					Less than 100
				</label>

				<label>
					<input type="radio" name="guests" value="Less than 150" />
					Less than 150
				</label>

				<label>
					<input type="radio" name="guests" value="Less than 200" />
					Less than 200
				</label>

				<label>
					<input type="radio" name="guests" value="200+ guests" />
					200+ guests
				</label>
			</div>

			<div class="question">
				<p>Which package suits best?</p>

				<label>
					<input type="radio" name="package" value="Menu A" required />
					Menu A - €85 per person
				</label>

				<label>
					<input type="radio" name="package" value="Menu B" />
					Menu B - €95 per person
				</label>

				<label>
					<input type="radio" name="package" value="Menu C" />
					Menu C - €105 per person
				</label>
			</div>

			<div class="question">
				<p>Are there any dietary requirements?</p>

				<label>
					<input type="radio" name="dietary" value="Yes" required />
					Yes
				</label>

				<label>
					<input type="radio" name="dietary" value="No" />
					No
				</label>
			</div>

			<div class="comment">
				<label for="comments">Other Details</label>

				<textarea
					id="comments"
					name="comments"
					placeholder="Tell us anything about your event..."
				></textarea>
			</div>

			<button type="submit">
				Submit Enquiry
			</button>

			{#if form?.message}
				<p class:success={form.success} class:error={!form.success}>
					{form.message}
				</p>
			{/if}
		</div>
	</div>
</form>

<style>
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		background: rgba(225, 186, 248, 0.986);
		font-family: Arial, sans-serif;
		padding: 20px;
		box-sizing: border-box;
	}

	.feedback-card {
		background: white;
		color: black;
		padding: 25px;
		border-radius: 12px;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
		width: 420px;
		display: flex;
		flex-direction: column;
		gap: 15px;
	}

	.feedback-card h2,
	.feedback-card p,
	.feedback-card label {
		color: black;
	}

	.question {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.question p {
		margin: 0 0 6px;
		font-weight: bold;
	}

	label {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 0.95rem;
	}

	.comment {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.comment label {
		font-weight: bold;
	}

	textarea {
		width: 100%;
		min-height: 140px;
		padding: 12px;
		border-radius: 8px;
		border: 1px solid #ccc;
		font-size: 0.95rem;
		resize: vertical;
		box-sizing: border-box;
		color: black;
		background: white;
	}

	textarea::placeholder {
		color: #666;
	}

	textarea:focus {
		outline: none;
		border-color: #555;
	}

	button {
		padding: 10px;
		background: black;
		color: white;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		transition: background 0.2s;
	}

	button:hover {
		background: #0066ff;
	}

	.success,
	.error {
		text-align: center;
		margin-top: 10px;
		font-weight: bold;
	}

	.success {
		color: green;
	}

	.error {
		color: red;
	}
</style>