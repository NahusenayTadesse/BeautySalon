<h1>Welcome to Dashboard</h1>

<script lang="ts">
	import { enhance } from '$app/forms';

 let {data, form} = $props();
</script>

<form method="post" use:enhance action="?/send">
    <input type="text" name="message" placeholder="Type your message" required />
    <button type="submit">Send to Telegram</button>
</form>

Welcome {data.role?.name}

{#if form?.success}
    <p>✅ Sent: {form.sent}</p>
{:else if form?.error}
    <p>❌ Error: {form.error}</p>
{/if}
Branch Id = 
{data.role?.branch}


