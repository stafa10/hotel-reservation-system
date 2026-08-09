export function getRoomImage(img) {
	if (!img) return '/uploads/default.jpg';

	if (img.startsWith('http')) return img;

	if (img.startsWith('/uploads/')) return img;

	return `/uploads/${img}`;
}