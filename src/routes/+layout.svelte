<script>
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';

	import 'bootstrap/dist/css/bootstrap.min.css';
	import 'bootstrap-icons/font/bootstrap-icons.min.css';

	let { data, children } = $props();

	onMount(async () => {
		if (browser) {
			await import('bootstrap');
		}
	});

	const navLinks = [
		{ href: '/', label: 'Home', icon: 'bi-house-door' },
		{ href: '/rooms', label: 'Rooms', icon: 'bi-door-open' },
		{ href: '/booking', label: 'Book', icon: 'bi-calendar-check' },
		{ href: '/about', label: 'About', icon: 'bi-info-circle' },
		{ href: '/contact', label: 'Contact', icon: 'bi-envelope' },
		{ href: '/enquiry', label: 'Enquiry', icon: 'bi-chat-dots' },
		{ href: '/feedback', label: 'Feedback', icon: 'bi-star' },
		{ href: '/cart', label: 'Cart', icon: 'bi-cart' },
	];
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
	<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
</svelte:head>

<!-- NAVBAR -->
<header class="site-nav">
	<nav class="nav-inner">
		<a href="/" class="brand">GRAND LUXE</a>

		<button class="nav-toggle navbar-toggler" type="button"
			data-bs-toggle="collapse" data-bs-target="#navMenu"
			aria-controls="navMenu" aria-expanded="false" aria-label="Toggle navigation">
			<i class="bi bi-list"></i>
		</button>

		<div class="collapse navbar-collapse nav-links" id="navMenu">
			{#each navLinks as link}
				<a href={link.href} class="nav-link">
					{link.label}
				</a>
			{/each}

			<div class="nav-auth">
				{#if data?.user}
					{#if data.user.role === 'admin'}
						<a class="auth-btn admin-btn" href="/admin">
							<i class="bi bi-shield-lock"></i> Admin
						</a>
					{/if}
					<span class="greeting">Hi, {data.user.name}</span>
					<form method="POST" action="/logout">
						<button class="auth-btn logout-btn" type="submit">Logout</button>
					</form>
				{:else}
					<a class="auth-btn ghost-btn" href="/auth/login">Login</a>
					<a class="auth-btn gold-btn" href="/auth/register">Register</a>
				{/if}
			</div>
		</div>
	</nav>
</header>

<main>
	{@render children()}
</main>

<footer class="site-footer">
	<div class="footer-inner">
		<div class="footer-brand">
			<span class="brand">GRAND LUXE</span>
			<p>Luxury beyond imagination. Dublin, Ireland.</p>
		</div>
		<div class="footer-links">
			<a href="/rooms">Rooms</a>
			<a href="/booking">Book</a>
			<a href="/contact">Contact</a>
			<a href="/about">About</a>
		</div>
		<div class="footer-contact">
			<p><a href="tel:+35312345678">+353 123 45678</a></p>
			<p><a href="mailto:info@grandluxe.com">info@grandluxe.com</a></p>
		</div>
	</div>
	<div class="footer-bottom">© 2026 Grand Luxe Hotel. All rights reserved.</div>
</footer>

<style>
	:global(*, *::before, *::after) { box-sizing: border-box; }
	:global(body) {
		margin: 0;
		font-family: 'Inter', system-ui, sans-serif;
		background: #faf9f7;
		color: #1a1a1a;
	}
	:global(h1, h2, h3, h4) {
		font-family: 'Cormorant Garamond', Georgia, serif;
	}
	:global(main) { min-height: 60vh; }

	/* NAV */
	.site-nav {
		position: sticky;
		top: 0;
		z-index: 100;
		background: rgba(10, 22, 40, 0.97);
		backdrop-filter: blur(12px);
		border-bottom: 1px solid rgba(212, 175, 55, 0.2);
	}
	.nav-inner {
		max-width: 1280px;
		margin: 0 auto;
		padding: 0 2rem;
		height: 64px;
		display: flex;
		align-items: center;
		gap: 2rem;
	}
	.brand {
		font-family: 'Cormorant Garamond', serif;
		font-size: 1.4rem;
		font-weight: 700;
		letter-spacing: 4px;
		color: #D4AF37;
		text-decoration: none;
		white-space: nowrap;
	}
	.nav-links {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		flex: 1;
	}
	.nav-link {
		color: rgba(255,255,255,0.8);
		text-decoration: none;
		font-size: 0.85rem;
		font-weight: 500;
		letter-spacing: 0.5px;
		padding: 0.4rem 0.75rem;
		border-radius: 6px;
		transition: 0.2s;
	}
	.nav-link:hover { color: #D4AF37; background: rgba(212,175,55,0.08); }
	.nav-auth {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-left: auto;
	}
	.greeting { color: rgba(255,255,255,0.6); font-size: 0.82rem; }
	.auth-btn {
		padding: 0.4rem 1rem;
		border-radius: 6px;
		font-size: 0.82rem;
		font-weight: 600;
		text-decoration: none;
		cursor: pointer;
		border: none;
		transition: 0.2s;
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
	}
	.gold-btn { background: #D4AF37; color: #000; }
	.gold-btn:hover { background: #FFD95A; }
	.ghost-btn { border: 1px solid rgba(255,255,255,0.3); color: white; background: transparent; }
	.ghost-btn:hover { border-color: #D4AF37; color: #D4AF37; }
	.admin-btn { background: #f59e0b; color: #000; }
	.logout-btn { background: transparent; border: 1px solid rgba(255,255,255,0.25); color: rgba(255,255,255,0.7); }
	.logout-btn:hover { border-color: #D4AF37; color: #D4AF37; }
	.nav-toggle {
		display: none;
		background: none;
		border: 1px solid rgba(255,255,255,0.3);
		color: white;
		font-size: 1.3rem;
		padding: 0.3rem 0.6rem;
		border-radius: 6px;
		margin-left: auto;
	}

	/* FOOTER */
	.site-footer {
		background: #0a1628;
		color: rgba(255,255,255,0.7);
		padding: 3rem 2rem 1.5rem;
	}
	.footer-inner {
		max-width: 1280px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 2fr 1fr 1fr;
		gap: 2rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid rgba(255,255,255,0.08);
	}
	.footer-brand p { font-size: 0.85rem; margin-top: 0.5rem; color: rgba(255,255,255,0.4); }
	.footer-links, .footer-contact { display: flex; flex-direction: column; gap: 0.5rem; }
	.footer-links a, .footer-contact a {
		color: rgba(255,255,255,0.5);
		text-decoration: none;
		font-size: 0.85rem;
		transition: 0.2s;
	}
	.footer-links a:hover, .footer-contact a:hover { color: #D4AF37; }
	.footer-bottom {
		max-width: 1280px;
		margin: 1.5rem auto 0;
		font-size: 0.78rem;
		color: rgba(255,255,255,0.3);
		text-align: center;
	}

	@media (max-width: 900px) {
		.nav-toggle { display: block; }
		.nav-links {
			flex-direction: column;
			align-items: flex-start;
			padding: 1rem 0;
			gap: 0.25rem;
		}
		.nav-auth { margin-left: 0; flex-wrap: wrap; }
		.footer-inner { grid-template-columns: 1fr; }
	}
</style>