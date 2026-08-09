<script>
    import { tick } from 'svelte';
	let chatBody = $state();
	let open = $state(false);
	let message = $state('');
	let messages = $state([
		{
			id: 1,
			role: 'assistant',
			text: '👋 Welcome to Grand Luxe Hotel! How can I help you today?'
		}
	]);

	function toggleChat() {
		open = !open;
		console.log('🔄 Chat toggled:', open);
	}

	async function sendMessage() {
		if (!message.trim()) {
			console.warn('⚠️ Empty message – ignoring.');
			return;
		}

		const userMessage = message;
		const userMsgId = Date.now();

		// Add user message
		messages = [...messages, { id: userMsgId, role: 'user', text: userMessage }];
		message = '';

		// Scroll to bottom
		await tick();
		scrollToBottom();

		try {
			console.log('📤 Sending to /api/chat:', userMessage);

			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ message: userMessage })
			});

			console.log('📥 Response status:', response.status);

			if (!response.ok) {
				const errorText = await response.text();
				console.error('❌ API error response:', errorText);
				throw new Error(`HTTP ${response.status}: ${errorText}`);
			}

			const data = await response.json();
			console.log('📦 Parsed response:', data);

			const reply = data.reply || data.message || data.response || '⚠️ No reply from API.';

			messages = [
				...messages,
				{
					id: Date.now() + 1,
					role: 'assistant',
					text: reply
				}
			];

			await tick();
			scrollToBottom();

		} catch (error) {
			console.error('❌ Chat error:', error);
			messages = [
				...messages,
				{
					id: Date.now() + 1,
					role: 'assistant',
					text: `⚠️ Error: ${error.message || 'Something went wrong.'}`
				}
			];
			await tick();
			scrollToBottom();
		}
	}

	function scrollToBottom() {
	if (chatBody) {
		chatBody.scrollTop = chatBody.scrollHeight;
	}
}

	$effect(() => {
		if (open) {
			setTimeout(scrollToBottom, 50);
		}
	});
</script>

<!-- 💬 Toggle button -->
<button class="chat-button" type="button" onclick={toggleChat}>
	💬
</button>

<!-- 💬 Chat window -->
{#if open}
<div class="chat-window">

	<div class="chat-header">
		Grand Luxe Concierge
		<button class="close-btn" type="button" onclick={toggleChat}>✕</button>
	</div>

	<div class="chat-body" bind:this={chatBody}>
		{#each messages as msg (msg.id)}
			<p class="message {msg.role}">
				<strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong>
				{msg.text}
			</p>
		{/each}
	</div>

	<div class="chat-footer">
		<input
			bind:value={message}
			placeholder="Ask us anything..."
			onkeydown={(e) => e.key === 'Enter' && sendMessage()}
		/>
		<button type="button" onclick={sendMessage}>
			Send
		</button>
	</div>

</div>
{/if}


<style>
.chat-button {
	position: fixed;
	bottom: 25px;
	right: 25px;
	width: 65px;
	height: 65px;
	border: none;
	border-radius: 50%;
	background: #d4af37;
	color: white;
	font-size: 28px;
	cursor: pointer;
	box-shadow: 0 8px 25px rgba(0, 0, 0, .3);
	z-index: 1000;
	transition: transform .2s;
}
.chat-button:hover {
	transform: scale(1.08);
}

.chat-window {
	position: fixed;
	right: 25px;
	bottom: 100px;
	width: 380px;
	max-height: 520px;
	background: #ffffff;
	border-radius: 16px;
	box-shadow: 0 20px 50px rgba(0, 0, 0, .35);
	overflow: hidden;
	z-index: 1000;
	display: flex;
	flex-direction: column;
	font-family: 'Inter', system-ui, sans-serif;
}

.chat-header {
	background: #0a1628;
	color: white;
	padding: 16px 20px;
	font-weight: 700;
	font-size: 1.05rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-shrink: 0;
}
.close-btn {
	background: transparent;
	border: none;
	color: #94a3b8;
	font-size: 1.2rem;
	cursor: pointer;
	padding: 0 4px;
}
.close-btn:hover {
	color: white;
}

.chat-body {
	padding: 16px 20px;
	line-height: 1.6;
	flex: 1;
	overflow-y: auto;
	max-height: 350px;
	background: #f8fafc;
}
.chat-body .message {
	margin: 8px 0;
	padding: 8px 14px;
	border-radius: 12px;
	max-width: 85%;
	word-wrap: break-word;
}
.chat-body .message.assistant {
	background: #e2e8f0;
	color: #0f172a;
	align-self: flex-start;
}
.chat-body .message.user {
	background: #d4af37;
	color: white;
	margin-left: auto;
	align-self: flex-end;
}
.chat-body .message strong {
	margin-right: 4px;
}

.chat-footer {
	display: flex;
	padding: 12px 16px;
	border-top: 1px solid #e2e8f0;
	gap: 10px;
	flex-shrink: 0;
	background: white;
}
.chat-footer input {
	flex: 1;
	padding: 10px 14px;
	border: 1px solid #e2e8f0;
	border-radius: 30px;
	outline: none;
	font-size: 0.95rem;
	transition: border-color .2s;
}
.chat-footer input:focus {
	border-color: #d4af37;
}
.chat-footer button {
	padding: 10px 22px;
	background: #d4af37;
	color: white;
	border: none;
	border-radius: 30px;
	font-weight: 600;
	cursor: pointer;
	transition: background .2s;
}
.chat-footer button:hover {
	background: #b8962e;
}
</style>