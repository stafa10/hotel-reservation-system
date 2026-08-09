<script>
let currentImage = $state(0);
let showLightbox = $state(false);
function nextImage() {
	if (currentImage < roomGallery[data.room.type].length - 1) {
		currentImage++;
	} else {
		currentImage = 0;
	}
}

function previousImage() {
	if (currentImage > 0) {
		currentImage--;
	} else {
		currentImage = roomGallery[data.room.type].length - 1;
	}
}
const roomGallery = {
	single: [
		'/single.jpg',
		'/single2.jpg',
		'/single3.jpg',
	],

	double: [
		'/double.jpg',
		'/double2.jpg',
		'/double3.jpg',
	],

	deluxe: [
		'/deluxe.jpg',
		'/deluxe2.jpg',
		'/deluxe3.jpg',
	],

	suite: [
		'/suite.jpg',
		'/suite2.jpg',
		'/suite3.jpg',
	]
};
	let { data } = $props();

</script>

<svelte:head>
	<title>{data.room.type} Room | Grand Luxe Hotel</title>
</svelte:head>

<div class="container">

	<div class="gallery">

	<img
	class="main-image"
	src={roomGallery[data.room.type][currentImage]}
	alt=""
	onclick={() => (showLightbox = true)}
/>
<div class="image-counter">
	{currentImage + 1} / {roomGallery[data.room.type].length}
</div>
	<div class="gallery-grid">

		{#each roomGallery[data.room.type] as image, i}

			<img
				src={image}
				alt=""
				class:selected={currentImage === i}
				onclick={() => currentImage = i}
			/>

		{/each}

	</div>

</div>

</div>

	<h1>{data.room.type} Room</h1>

	<p class="price">
		€{data.room.price} / night
	</p>

	<p>

		<strong>Room Number:</strong>

		{data.room.roomNumber}

	</p>

	<p>

		<strong>Beds:</strong>

		{data.room.beds}

	</p>

	<hr>

	<h2>Description</h2>

	{#if data.room.type === 'single'}

		<p>
			A stylish room perfect for solo travellers looking for comfort and elegance.
		</p>

	{:else if data.room.type === 'double'}

		<p>
			A spacious room ideal for couples and business travellers.
		</p>

	{:else if data.room.type === 'deluxe'}

		<p>
			Experience extra luxury with premium furnishings and panoramic views.
		</p>

	{:else}

		<p>
			Our finest accommodation featuring generous living space and premium amenities.
		</p>

	{/if}

	<hr>
    <h2>Room Highlights</h2>

<div class="highlights">

	<div>🛏 Premium Bed</div>

	<div>📶 High-Speed WiFi</div>

	<div>📺 Smart TV</div>

	<div>❄ Air Conditioning</div>

	<div>☕ Coffee Machine</div>

	<div>🛁 Luxury Bathroom</div>

</div>

	<h2>Amenities</h2>

	<ul>

		<li>Free WiFi</li>

		<li>Breakfast Included</li>

		<li>Smart TV</li>

		<li>Air Conditioning</li>

		<li>Luxury Bathroom</li>

	</ul>

	<h2>Why Guests Love This Room</h2>

<div class="features-grid">

	<div>🛏 Luxury Mattress</div>

	<div>🚿 Rain Shower</div>

	<div>📶 Fast WiFi</div>

	<div>☕ Complimentary Coffee</div>

	<div>🌡 Climate Control</div>

	<div>🧹 Daily Housekeeping</div>

	<div>🔒 Electronic Safe</div>

	<div>🅿 Free Parking</div>

</div>

	<a
		href={`/rooms?checkin=${data.checkin}&checkout=${data.checkout}&guests=${data.guests}`}
		class="book-btn"
	>
    <div class="rating">

★★★★★

<span>9.6 Excellent (214 Reviews)</span>

</div>

		Reserve this Room

	</a>

{#if showLightbox}

<div
	class="lightbox"
	onclick={() => (showLightbox = false)}
>

	<button
		class="close-btn"
		onclick={(e) => {
			e.stopPropagation();
			showLightbox = false;
		}}
	>
		✕
	</button>

	<button
		class="arrow left"
		onclick={(e) => {
			e.stopPropagation();
			previousImage();
		}}
	>
		❮
	</button>

	<img
		src={roomGallery[data.room.type][currentImage]}
		alt=""
		onclick={(e) => e.stopPropagation()}
	/>

	<button
		class="arrow right"
		onclick={(e) => {
			e.stopPropagation();
			nextImage();
		}}
	>
		❯
	</button>

</div>

{/if}
<style>
.container{
	max-width:900px;
	margin:auto;
	padding:40px;
}

.gallery{
	margin-bottom:35px;
}

.main-image{
	width:100%;
	height:450px;
	object-fit:cover;
	border-radius:18px;
	margin-bottom:12px;
}

.gallery-grid{
	display:grid;
	grid-template-columns:repeat(3,1fr);
	gap:12px;
}

.gallery-grid img{
	width:100%;
	height:130px;
	object-fit:cover;
	border-radius:12px;
	cursor:pointer;
	transition:.3s;
}

.gallery-grid img:hover{
	transform:scale(1.03);
}

h1{
	font-size:3rem;
}

.price{
	font-size:28px;
	color:#D4AF37;
	font-weight:bold;
}

.book-btn{
	display:block;
	width:100%;
	text-align:center;
	padding:18px;
	background:linear-gradient(90deg,#D4AF37,#FFD95A);
	color:black;
	font-weight:bold;
	font-size:18px;
	border-radius:12px;
	text-decoration:none;
	transition:.3s;
}

.book-btn:hover{
	transform:translateY(-3px);
	box-shadow:0 10px 30px rgba(212,175,55,.35);
}
.highlights{
	display:grid;
	grid-template-columns:repeat(2,1fr);
	gap:14px;
	margin:25px 0;
}

.highlights div{
	background:#f6f6f6;
	padding:14px;
	border-radius:10px;
	font-weight:600;
}
.rating{
	margin:30px 0;
	font-size:22px;
	color:#D4AF37;
}

.rating span{
	display:block;
	font-size:16px;
	color:#444;
	margin-top:6px;
}

.gallery-grid img.selected{
	border:3px solid #D4AF37;
	opacity:1;
	transform:scale(1.05);
}

.gallery-grid img{
	width:100%;
	height:130px;
	object-fit:cover;
	border-radius:12px;
	cursor:pointer;
	transition:.3s;
	opacity:.75;
	border:3px solid transparent;
}

.gallery-grid img:hover{
	opacity:1;
	transform:scale(1.05);
}
.lightbox{

	position:fixed;

	inset:0;

	background:rgba(0,0,0,.9);

	display:flex;

	align-items:center;

	justify-content:center;

	z-index:9999;

	cursor:pointer;

}

.lightbox img{

	max-width:90%;

	max-height:90%;

	border-radius:16px;

	box-shadow:0 20px 60px rgba(0,0,0,.5);

}
.lightbox{
	position:fixed;
	inset:0;
	background:rgba(0,0,0,.92);
	display:flex;
	align-items:center;
	justify-content:center;
	z-index:9999;
}

.lightbox img{
	max-width:85%;
	max-height:85%;
	border-radius:18px;
	box-shadow:0 20px 60px rgba(0,0,0,.5);
}

.arrow{
	position:absolute;
	top:50%;
	transform:translateY(-50%);
	font-size:60px;
	background:none;
	border:none;
	color:white;
	cursor:pointer;
	padding:20px;
	transition:.25s;
}

.arrow:hover{
	transform:translateY(-50%) scale(1.15);
	color:#D4AF37;
}

.left{
	left:40px;
}

.right{
	right:40px;
}

.close-btn{
	position:absolute;
	top:30px;
	right:40px;
	font-size:40px;
	background:none;
	border:none;
	color:white;
	cursor:pointer;
	transition:.25s;
}

.close-btn:hover{
	color:#D4AF37;
	transform:rotate(90deg);
}

.image-counter{
	position:absolute;
	bottom:35px;
	left:50%;
	transform:translateX(-50%);
	background:rgba(0,0,0,.6);
	color:white;
	padding:10px 20px;
	border-radius:30px;
	font-size:18px;
	font-weight:bold;
	backdrop-filter:blur(6px);
}

.features-grid{
	display:grid;
	grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
	gap:15px;
	margin:30px 0;
}

.features-grid div{
	background:#fafafa;
	padding:18px;
	border-radius:12px;
	font-weight:600;
	box-shadow:0 4px 12px rgba(0,0,0,.08);
	transition:.3s;
}

.features-grid div:hover{
	transform:translateY(-4px);
	box-shadow:0 10px 25px rgba(0,0,0,.12);
}
</style>