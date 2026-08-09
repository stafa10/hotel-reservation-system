<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let status = $state('verifying');

	onMount(async () => {
		const token = $page.url.searchParams.get('token');

		if (!token) {
			status = 'invalid';
			return;
		}

		try {
			const res = await fetch(`/api/auth/verify-email?token=${token}`, {
				method: 'GET'
			});

			if (res.ok) {
				status = 'success';
				setTimeout(() => goto('/auth/login'), 3000);
			} else {
				status = 'error';
			}
		} catch {
			status = 'error';
		}
	});
</script>

<div class="container d-flex justify-content-center align-items-center" style="min-height:70vh;">
	<div class="card shadow-sm text-center p-5" style="max-width:480px;width:100%;">

		{#if status === 'verifying'}
			<div class="spinner-border text-success mb-3" role="status"></div>
			<h4>Verifying your email...</h4>

		{:else if status === 'success'}
			<div style="font-size:3rem;">✅</div>
			<h4 class="mt-3">Email verified!</h4>
			<p class="text-muted">Redirecting you to login in 3 seconds...</p>
			<a href="/auth/login" class="btn btn-primary mt-2">Go to Login</a>

		{:else if status === 'invalid'}
			<div style="font-size:3rem;">⚠️</div>
			<h4 class="mt-3">Invalid link</h4>
			<p class="text-muted">No verification token found in the link.</p>
			<a href="/auth/register" class="btn btn-primary mt-2">Register again</a>

		{:else}
			<div style="font-size:3rem;">❌</div>
			<h4 class="mt-3">Verification failed</h4>
			<p class="text-muted">The link may have expired. Please register again.</p>
			<a href="/auth/register" class="btn btn-primary mt-2">Register again</a>
		{/if}

	</div>
</div>