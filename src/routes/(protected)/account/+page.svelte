<script>
	let { data } = $props();
</script>

<h1>Account Page</h1>

{#if data?.user}
	<p>Welcome {data.user.name}</p>
	<p>Email: {data.user.email}</p>
{:else}
	<p>No user found</p>
{/if}
