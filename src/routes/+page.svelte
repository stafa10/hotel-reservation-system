<script>
    import { fade } from 'svelte/transition';

	import ChatBot from '$lib/ChatBot.svelte';
	
	import { onMount } from 'svelte';

	const videos = [
		'/hotel1.mp4',
		'/hotel2.mp4',
		'/hotel3.mp4',
		'/hotel4.mp4',
		'/hotel5.mp4'
	];

	let currentVideo = $state(0);

	onMount(() => {
	const timer = setInterval(() => {
		currentVideo = (currentVideo + 1) % videos.length;
	}, 8000);

	return () => clearInterval(timer);
});
</script>

<svelte:head>
	<title>Grand Luxe Hotel — Dublin</title>
</svelte:head>

<!-- HERO -->
<section class="hero">

	{#key currentVideo}
	<video
		class="hero-video"
		autoplay
		muted
		loop
		playsinline
		in:fade={{ duration: 800 }}
		out:fade={{ duration: 800 }}
	>
		<source src={videos[currentVideo]} type="video/mp4" />
	</video>
{/key}

	<div class="hero-overlay"></div>

<div
	class="hero-content"
	in:fade={{ duration: 1200 }}
>

	<p class="hero-eyebrow">
		Dublin's Finest
	</p>

	<h1>GRAND LUXE</h1>

	<p class="hero-sub">
		Where every stay becomes a story worth telling.
	</p>

	<div class="hero-actions">
		<a href="/booking" class="btn-gold">
			Reserve Your Suite
		</a>
	</div>

</div>
</section>

<!-- QUICK BOOK -->
<section class="quick-book">

	<div class="qb-inner">

		<div class="qb-text">
			<h3>Begin Your Stay</h3>
			<p>Best rate guaranteed · Free cancellation</p>
		</div>

		<a
			href="/booking"
			class="btn-gold"
		>
			Check Availability
		</a>

	</div>

</section>

<!-- STATS -->
<section class="stats-bar">

	<div class="stats-inner">

		<div class="stat">
			<strong>5★</strong>
			<span>Luxury Rating</span>
		</div>

		<div class="stat-divider"></div>

		<div class="stat">
			<strong>24/7</strong>
			<span>Concierge</span>
		</div>

		<div class="stat-divider"></div>

		<div class="stat">
			<strong>12+</strong>
			<span>Suite Types</span>
		</div>

		<div class="stat-divider"></div>

		<div class="stat">
			<strong>98%</strong>
			<span>Guest Satisfaction</span>
		</div>

	</div>

</section>
<!-- FEATURED SUITES -->
<section class="suites">
	<div class="section-inner">
		<div class="section-head">
			<p class="eyebrow">Accommodations</p>
			<h2>Featured Suites</h2>
			<p class="section-sub">Beautifully designed spaces offering exceptional comfort and elegance.</p>
		</div>

		<div class="suite-grid">
			<article class="suite-card">
				<div class="suite-img-wrap">
					<img src="https://images.unsplash.com/photo-1590490360182-c33d57733427?w=900" alt="Executive Suite" />
					<span class="suite-tag">Most Popular</span>
				</div>
				<div class="suite-body">
					<h3>Executive Suite</h3>
					<p>Modern luxury with spacious interiors, king-size bed and premium amenities.</p>
					<div class="suite-meta">
						<span><i class="bi bi-people-fill"></i> 2 Guests</span>
						<span><i class="bi bi-aspect-ratio"></i> 45 m²</span>
						<span><i class="bi bi-wifi"></i> Free WiFi</span>
					</div>
					<a href="/booking" class="suite-btn">Book Now</a>
				</div>
			</article>

			<article class="suite-card">
				<div class="suite-img-wrap">
					<img src="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=900" alt="Presidential Suite" />
					<span class="suite-tag premium">Presidential</span>
				</div>
				<div class="suite-body">
					<h3>Presidential Suite</h3>
					<p>The finest accommodation featuring luxurious living spaces and exclusive services.</p>
					<div class="suite-meta">
						<span><i class="bi bi-people-fill"></i> 3 Guests</span>
						<span><i class="bi bi-aspect-ratio"></i> 80 m²</span>
						<span><i class="bi bi-cup-hot"></i> Butler Service</span>
					</div>
					<a href="/booking" class="suite-btn">Book Now</a>
				</div>
			</article>
		</div>

		<div class="section-cta">
			<a href="/rooms" class="btn-outline-dark">View All Rooms</a>
		</div>
	</div>
</section>

<!-- SERVICES -->
<section class="services">
	<div class="section-inner">
		<div class="section-head light">
			<p class="eyebrow gold">Our Services</p>
			<h2>Luxury at Every Turn</h2>
			<p class="section-sub light-sub">Private spa, Michelin dining, ocean view suites, and 24/7 concierge.</p>
		</div>

		<div class="service-grid">
			<div class="service-card">
				<div class="service-icon"><i class="bi bi-water"></i></div>
				<h4>Spa & Wellness</h4>
				<p>Immerse in our world-class thermal spa, steam rooms, and wellness therapies.</p>
			</div>
			<div class="service-card">
				<div class="service-icon"><i class="bi bi-cup-hot"></i></div>
				<h4>Fine Dining</h4>
				<p>Michelin-starred cuisine crafted from the finest seasonal Irish produce.</p>
			</div>
			<div class="service-card">
				<div class="service-icon"><i class="bi bi-wifi"></i></div>
				<h4>High-Speed WiFi</h4>
				<p>Ultra-fast fibre internet throughout every room and public space.</p>
			</div>
			<div class="service-card">
				<div class="service-icon"><i class="bi bi-shield-check"></i></div>
				<h4>24/7 Security</h4>
				<p>Discreet professional security ensuring your complete peace of mind.</p>
			</div>
		</div>
	</div>
</section>

<!-- EXPERIENCE GALLERY -->
<section class="experience">
	<div class="section-inner">
		<div class="section-head">
			<p class="eyebrow">The Grand Luxe Life</p>
			<h2>An Unforgettable Experience</h2>
		</div>

		<div class="exp-grid">
			<div class="exp-card tall">
				<img src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800" alt="Luxury Suite" />
				<div class="exp-overlay">
					<h3>Luxury Suites</h3>
					<p>Panoramic views and king-size comfort</p>
				</div>
			</div>
			<div class="exp-card">
				<img src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800" alt="Restaurant" />
				<div class="exp-overlay">
					<h3>Fine Dining</h3>
					<p>Award-winning chefs, world-class cuisine</p>
				</div>
			</div>
			<div class="exp-card">
				<img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800" alt="Spa" />
				<div class="exp-overlay">
					<h3>Spa & Wellness</h3>
					<p>Heated pools and luxury treatments</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- WHY US -->
<section class="why">
	<div class="section-inner">
		<div class="section-head">
			<p class="eyebrow">Why Grand Luxe</p>
			<h2>The Difference is in the Details</h2>
		</div>
		<div class="why-grid">
			<div class="why-card">
				<span class="why-icon">⭐</span>
				<h4>5-Star Certified</h4>
				<p>Independently verified luxury standards across every touchpoint.</p>
			</div>
			<div class="why-card">
				<span class="why-icon">🏆</span>
				<h4>Award Winning</h4>
				<p>Recognised by the Irish Hotels Federation for excellence in hospitality.</p>
			</div>
			<div class="why-card">
				<span class="why-icon">🌍</span>
				<h4>Prime Location</h4>
				<p>Steps from Dublin's finest shopping, culture, and dining districts.</p>
			</div>
			<div class="why-card">
				<span class="why-icon">🕒</span>
				<h4>Always Available</h4>
				<p>Dedicated concierge on call around the clock for every request.</p>
			</div>
		</div>
	</div>
</section>

<!-- CONTACT STRIP -->
<section class="contact-strip">
	<div class="cs-inner">
		<h2>Ready to Experience Grand Luxe?</h2>
		<p>Call us or book directly online — our team is ready to welcome you.</p>
		<div class="cs-actions">
			<a href="/booking" class="btn-gold">Reserve Now</a>
			<a href="tel:+35312345678" class="btn-ghost-dark">+353 123 45678</a>
		</div>
	</div>
</section>

<style>
	/* ── TOKENS ── */
	:global(body) {
		margin: 0;
		font-family: 'Inter', system-ui, sans-serif;
		background: #faf9f7;
		color: #1a1a1a;
	}
	:global(h1,h2,h3,h4) { font-family: 'Cormorant Garamond', Georgia, serif; }

	/* ── HERO ── */
	.hero{
	position:relative;
	height:100vh;
	min-height:650px;
	overflow:hidden;
	display:flex;
	align-items:center;
	justify-content:center;
	text-align:center;
}

.hero-video{
	position:absolute;
	inset:0;
	width:100%;
	height:100%;
	object-fit:cover;
	object-position:center center;
	z-index:0;

	transform:scale(1);
	animation:heroZoom 18s ease-in-out infinite alternate;
}
.hero-overlay{
	position:absolute;
	inset:0;
	background:rgba(0,0,0,.45);
	z-index:1;
}

.hero-content{
	position:relative;
	z-index:2;
	color:white;
}
	.hero-eyebrow {
		font-size: 0.78rem;
		letter-spacing: 4px;
		text-transform: uppercase;
		color: #D4AF37;
		margin: 0 0 1rem;
		font-weight: 500;
	}
	.hero h1 {
		font-size: clamp(3.5rem, 9vw, 7rem);
		letter-spacing: 10px;
		color: white;
		margin: 0 0 1.2rem;
		line-height: 1;
		font-weight: 700;
	}
	.hero-sub {
		font-size: clamp(1rem, 2vw, 1.25rem);
		color: rgba(255,255,255,0.8);
		margin: 0 0 2.5rem;
		font-weight: 300;
		letter-spacing: 0.5px;
	}
	.hero-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
	.hero-scroll {
		position: absolute;
		bottom: 2rem;
		left: 50%;
		transform: translateX(-50%);
		z-index: 2;
	}
	.hero-scroll span {
		display: block;
		width: 1px;
		height: 48px;
		background: linear-gradient(to bottom, rgba(212,175,55,0) 0%, #D4AF37 100%);
		margin: 0 auto;
		animation: scrollLine 2s ease-in-out infinite;
	}
	@keyframes scrollLine {
		0%, 100% { opacity: 0; transform: scaleY(0); transform-origin: top; }
		50% { opacity: 1; transform: scaleY(1); transform-origin: top; }
	}

	/* ── BUTTONS ── */
	.btn-gold {
		display: inline-block;
		padding: 0.85rem 2rem;
		background: linear-gradient(90deg, #D4AF37, #FFD95A);
		color: #000;
		font-weight: 700;
		font-size: 0.88rem;
		letter-spacing: 1px;
		border-radius: 4px;
		text-decoration: none;
		transition: 0.3s;
		text-transform: uppercase;
	}
	.btn-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(212,175,55,0.4); color: #000; }
	.btn-ghost {
		display: inline-block;
		padding: 0.85rem 2rem;
		border: 1px solid rgba(255,255,255,0.5);
		color: white;
		font-weight: 500;
		font-size: 0.88rem;
		letter-spacing: 1px;
		border-radius: 4px;
		text-decoration: none;
		transition: 0.3s;
		text-transform: uppercase;
	}
	.btn-ghost:hover { border-color: #D4AF37; color: #D4AF37; }
	.btn-outline-dark {
		display: inline-block;
		padding: 0.75rem 2rem;
		border: 1px solid #1a1a1a;
		color: #1a1a1a;
		font-size: 0.82rem;
		font-weight: 600;
		letter-spacing: 1.5px;
		text-transform: uppercase;
		border-radius: 4px;
		text-decoration: none;
		transition: 0.3s;
	}
	.btn-outline-dark:hover { background: #1a1a1a; color: white; }
	.btn-ghost-dark {
		display: inline-block;
		padding: 0.85rem 2rem;
		border: 1px solid rgba(255,255,255,0.4);
		color: white;
		font-size: 0.88rem;
		font-weight: 500;
		letter-spacing: 1px;
		text-transform: uppercase;
		border-radius: 4px;
		text-decoration: none;
		transition: 0.3s;
	}
	.btn-ghost-dark:hover { border-color: #D4AF37; color: #D4AF37; }

	/* ── QUICK BOOK ── */
	.quick-book {
		background: #0a1628;
		padding: 1.5rem 2rem;
	}
	.qb-inner {
		max-width: 1280px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.5rem;
		flex-wrap: wrap;
	}
	.qb-text h3 { font-size: 1.3rem; color: white; margin: 0; }
	.qb-text p { color: rgba(255,255,255,0.5); font-size: 0.82rem; margin: 0.2rem 0 0; }

	/* ── STATS ── */
	.stats-bar { background: #f0ece3; padding: 2rem; }
	.stats-inner {
		max-width: 900px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0;
		flex-wrap: wrap;
	}
	.stat { text-align: center; padding: 0 3rem; }
	.stat strong { display: block; font-family: 'Cormorant Garamond', serif; font-size: 2.2rem; font-weight: 700; color: #0a1628; line-height: 1; }
	.stat span { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 1.5px; color: #888; }
	.stat-divider { width: 1px; height: 40px; background: #ccc; }

	/* ── SECTION COMMON ── */
	.section-inner { max-width: 1280px; margin: 0 auto; padding: 0 2rem; }
	.section-head { text-align: center; margin-bottom: 3rem; }
	.eyebrow { font-size: 0.72rem; letter-spacing: 4px; text-transform: uppercase; color: #888; margin: 0 0 0.75rem; font-weight: 500; }
	.eyebrow.gold { color: #D4AF37; }
	.section-head h2 { font-size: clamp(2rem, 4vw, 3rem); margin: 0 0 1rem; font-weight: 600; }
	.section-sub { color: #666; max-width: 560px; margin: 0 auto; font-size: 0.95rem; line-height: 1.7; }
	.section-cta { text-align: center; margin-top: 3rem; }

	/* ── SUITES ── */
	.suites { padding: 6rem 0; }
	.suite-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 2rem; }
	.suite-card { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.07); transition: 0.35s; }
	.suite-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.12); }
	.suite-img-wrap { position: relative; overflow: hidden; }
	.suite-img-wrap img { width: 100%; height: 260px; object-fit: cover; display: block; transition: 0.4s; }
	.suite-card:hover .suite-img-wrap img { transform: scale(1.04); }
	.suite-tag { position: absolute; top: 1rem; left: 1rem; background: #D4AF37; color: #000; font-size: 0.68rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 0.3rem 0.7rem; border-radius: 2px; }
	.suite-tag.premium { background: #0a1628; color: #D4AF37; }
	.suite-body { padding: 1.8rem; }
	.suite-body h3 { font-size: 1.6rem; margin: 0 0 0.6rem; color: #0a1628; font-weight: 600; }
	.suite-body p { color: #666; font-size: 0.9rem; line-height: 1.7; margin: 0 0 1.2rem; }
	.suite-meta { display: flex; gap: 1.2rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
	.suite-meta span { font-size: 0.8rem; color: #555; display: flex; align-items: center; gap: 0.3rem; }
	.suite-btn { display: block; text-align: center; padding: 0.8rem; background: linear-gradient(90deg, #D4AF37, #FFD95A); color: #000; font-weight: 700; font-size: 0.82rem; letter-spacing: 1px; text-transform: uppercase; text-decoration: none; border-radius: 4px; transition: 0.3s; }
	.suite-btn:hover { box-shadow: 0 6px 18px rgba(212,175,55,0.4); transform: translateY(-1px); }

	/* ── SERVICES ── */
	.services { padding: 6rem 0; background: #0a1628; }
	.section-head.light h2 { color: white; }
	.light-sub { color: rgba(255,255,255,0.5); }
	.service-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; }
	.service-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 2rem; transition: 0.3s; }
	.service-card:hover { background: rgba(212,175,55,0.08); border-color: rgba(212,175,55,0.3); transform: translateY(-4px); }
	.service-icon { font-size: 1.8rem; color: #D4AF37; margin-bottom: 1rem; }
	.service-card h4 { font-size: 1.2rem; color: white; margin: 0 0 0.5rem; }
	.service-card p { color: rgba(255,255,255,0.5); font-size: 0.88rem; line-height: 1.6; margin: 0; }

	/* ── EXPERIENCE ── */
	.experience { padding: 6rem 0; background: #faf9f7; }
	.exp-grid { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: auto auto; gap: 1rem; }
	.exp-card { position: relative; overflow: hidden; border-radius: 8px; }
	.exp-card.tall { grid-row: 1 / 3; }
	.exp-card img { width: 100%; height: 100%; min-height: 240px; object-fit: cover; display: block; transition: 0.4s; }
	.exp-card.tall img { min-height: 500px; }
	.exp-card:hover img { transform: scale(1.05); }
	.exp-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%);
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		padding: 1.5rem;
		color: white;
	}
	.exp-overlay h3 { font-size: 1.4rem; margin: 0 0 0.3rem; }
	.exp-overlay p { font-size: 0.82rem; color: rgba(255,255,255,0.7); margin: 0; }

	/* ── WHY ── */
	.why { padding: 6rem 0; background: #f0ece3; }
	.why-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; }
	.why-card { background: white; border-radius: 8px; padding: 2rem; text-align: center; transition: 0.3s; }
	.why-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.08); }
	.why-icon { font-size: 2rem; display: block; margin-bottom: 0.75rem; }
	.why-card h4 { font-size: 1.1rem; margin: 0 0 0.5rem; color: #0a1628; }
	.why-card p { font-size: 0.85rem; color: #666; line-height: 1.6; margin: 0; }

	/* ── CONTACT STRIP ── */
	.contact-strip { background: #0a1628; padding: 5rem 2rem; text-align: center; }
	.cs-inner { max-width: 600px; margin: 0 auto; }
	.cs-inner h2 { font-size: clamp(1.8rem, 3vw, 2.5rem); color: white; margin: 0 0 0.75rem; }
	.cs-inner p { color: rgba(255,255,255,0.5); margin: 0 0 2rem; font-size: 0.95rem; }
	.cs-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

	@media (max-width: 768px) {
		.exp-grid { grid-template-columns: 1fr; }
		.exp-card.tall { grid-row: auto; }
		.stat { padding: 1rem 1.5rem; }
		.stat-divider { display: none; }
	}
	@keyframes heroZoom{
	from{
		transform:scale(1);
	}
	to{
		transform:scale(1.08);
	}
}
</style>
<ChatBot />