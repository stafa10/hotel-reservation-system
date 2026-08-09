<script>
	let { form } = $props();
</script>

<h1>Reset Password</h1>

<form method="POST">
	<input
		type="password"
		name="password"
		placeholder="New Password"
		required
	/>

	<button type="submit">
		Reset Password
	</button>
</form>

{#if form?.message}
	<p>{form.message}</p>
{/if}