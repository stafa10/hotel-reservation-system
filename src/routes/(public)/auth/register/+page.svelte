<script>
	import { enhance } from '$app/forms';

	let { form } = $props();

	let showPassword = $state(false);
	let password = $state('');
	let confirmPassword = $state('');

	let loading = $state(false);

	function passwordStrength(password) {
		let score = 0;

		if (password.length >= 8) score++;
		if (/[a-z]/.test(password)) score++;
		if (/[A-Z]/.test(password)) score++;
		if (/\d/.test(password)) score++;
		if (/[^A-Za-z0-9]/.test(password)) score++;

		if (score <= 2) {
			return { text: 'Weak', color: 'danger', width: '33%' };
		}
		if (score <= 4) {
			return { text: 'Medium', color: 'warning', width: '66%' };
		}
		return { text: 'Strong', color: 'success', width: '100%' };
	}

	const strength = $derived(passwordStrength(password));

	const hasMinLength = $derived(password.length >= 8);
	const hasUppercase = $derived(/[A-Z]/.test(password));
	const hasLowercase = $derived(/[a-z]/.test(password));
	const hasNumber = $derived(/\d/.test(password));
	const hasSpecial = $derived(/[^A-Za-z0-9]/.test(password));
	const passwordsMatch = $derived(
		password.length > 0 && confirmPassword.length > 0 && password === confirmPassword
	);
</script>

<div class="container d-flex justify-content-center align-items-center" style="min-height:70vh;">
	<div class="card shadow-sm" style="max-width:500px;width:100%;">
		<div class="card-body p-4">
			<h3 class="text-center mb-4">
				<i class="bi bi-person-plus me-2"></i>
				Register
			</h3>

			{#if form?.success}
				<!-- Show success state instead of the form -->
				<div class="text-center py-4">
					<i class="bi bi-envelope-check-fill text-success" style="font-size:4rem;"></i>

					<h3 class="fw-bold mt-3">Check your email</h3>
					<p class="text-muted mb-4">
						We've sent a verification email.

						<br /><br />

						Please click the verification link in your inbox to activate your account.
					</p>
					<div class="alert alert-success">
						<i class="bi bi-check-circle-fill me-2"></i>

						Your account has been created successfully.
					</div>
					<a href="/auth/login" class="btn btn-outline-secondary mt-2"> Back to Login </a>
				</div>
			{:else}
				<form
					method="POST"
					action="?/signUpEmail"
					use:enhance={() => {
						loading = true;

						return async ({ update }) => {
							await update();
							loading = false;
						};
					}}
				>
					<!-- Name -->
					<div class="form-floating mb-3">
						<input
							id="name"
							name="name"
							class="form-control"
							placeholder="Name"
							required
							pattern="[A-Za-z\s]+"
							title="Only letters are allowed"
						/>
						<label for="name">Name</label>
					</div>

					<!-- Email -->
					<div class="form-floating mb-3">
						<input
							id="email"
							type="email"
							name="email"
							class="form-control"
							placeholder="Email"
							required
						/>
						<label for="email">Email address</label>
					</div>

					<!-- Password -->
					<div class="mb-3">
						<div class="input-group mb-2">
							<div class="form-floating flex-grow-1">
								<input
									id="password"
									type={showPassword ? 'text' : 'password'}
									name="password"
									class="form-control"
									placeholder="Password"
									bind:value={password}
									required
									minlength="8"
								/>

								<label for="password">Password</label>
							</div>

							<button
								type="button"
								class="btn btn-outline-secondary"
								onclick={() => (showPassword = !showPassword)}
							>
								<i class={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
							</button>
						</div>

						<!-- Progress Bar -->
						<div class="progress mt-3" style="height:8px;">
							<div
								class={`progress-bar bg-${strength.color}`}
								style={`width:${strength.width}`}
							></div>
						</div>

						<div class={`mt-2 text-${strength.color}`}>
							<strong>{strength.text}</strong>
						</div>

						<hr />

						<small>
							<div class={hasMinLength ? 'text-success' : 'text-danger'}>
								{hasMinLength ? '✔' : '✖'}&nbsp;Minimum 8 characters
							</div>
							<div class={hasUppercase ? 'text-success' : 'text-danger'}>
								{hasUppercase ? '✔' : '✖'}&nbsp;Uppercase letter
							</div>
							<div class={hasLowercase ? 'text-success' : 'text-danger'}>
								{hasLowercase ? '✔' : '✖'}&nbsp;Lowercase letter
							</div>
							<div class={hasNumber ? 'text-success' : 'text-danger'}>
								{hasNumber ? '✔' : '✖'}&nbsp;Number
							</div>
							<div class={hasSpecial ? 'text-success' : 'text-danger'}>
								{hasSpecial ? '✔' : '✖'}&nbsp;Special character
							</div>
						</small>
					</div>
					<div class="mb-3">
						<div class="form-floating">
							<input
								id="confirmPassword"
								type={showPassword ? 'text' : 'password'}
								class="form-control"
								placeholder="Confirm Password"
								bind:value={confirmPassword}
								required
							/>

							<label for="confirmPassword"> Confirm Password </label>
						</div>

						{#if confirmPassword.length > 0}
							<div class={`mt-2 ${passwordsMatch ? 'text-success' : 'text-danger'}`}>
								<i class={`bi ${passwordsMatch ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}`}></i>

								{#if passwordsMatch}
									Passwords match
								{:else}
									Passwords do not match
								{/if}
							</div>
						{/if}
					</div>

					<button type="submit" class="btn btn-primary w-100" disabled={loading || !passwordsMatch}>
						{#if loading}
							<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"
							></span>

							Registering...
						{:else}
							<i class="bi bi-person-plus me-1"></i>

							Register
						{/if}
					</button>
				</form>

				{#if form?.message && !form?.success}
					<div class="alert alert-danger mt-3">
						{form.message}
					</div>
				{/if}

				<hr />

				<p class="text-center mb-0">
					Already have an account?
					<a href="/auth/login">Login</a>
				</p>
			{/if}
		</div>
	</div>
</div>
