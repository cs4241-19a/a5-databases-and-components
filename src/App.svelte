<script>
	let chats = [
		{"name": "ChatBot", "content": "Yo what is up!", "time": new Date()},
		{"name": "ChatBot", "content": "I fully remade PermChat using just Svelte.", "time": new Date()},
		{"name": "ChatBot", "content": "Except I totally cheated and I didn't actually add the 'perm' part...", "time": new Date()},
		{"name": "ChatBot", "content": "Enjoy your stay and check out my README.md on github!", "time": new Date()},
	]
	
	let username = ""
	let contents = ""
	
	function addNewChat()
	{
		const chat = {"name": username, "content": contents, "time": new Date()}
		chats = [...chats, chat]
		contents = ""
	}
</script>

<style>
	h1 {
		color: purple;
	}
	
	.chat-username {
	  font-weight: bold;
	  font-size: 120%;
	  text-align: right;
	  padding: 1em;
	  min-width: 150px;
	}

	.chat-contents {
	  font-weight: normal;
	  text-align: left;
	  width: 100%;
	}

	.chat-timestamp {
	  font-weight: italic;
	  font-size: 75%;
	  color: #808080;
	  text-align: left;
	  min-width: 150px;
	}

	#chat-contents {
	  padding: 15px;
		width: 100%;
	}
</style>

<h1>ChatSvelte</h1>

<table id="chat-contents">
	{#each chats as chat}
		<tr>
			<th class="chat-username">{chat.name}</th>
			<th class="chat-contents">{chat.content}</th>
			<th class="chat-timestamp">{chat.time.toLocaleDateString()} <br/> {chat.time.toLocaleTimeString()}</th>
		</tr>
	{/each}
</table>

<div>
	<input bind:value={username} maxlength="100" placeholder="Username"/>
	<input bind:value={contents} maxlength="100" placeholder="Chat contents"/>
	<button on:click={addNewChat}>Send</button>
</div>
