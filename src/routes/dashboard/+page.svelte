<!-- <h1>Welcome to Dashboard</h1>

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
{data.role?.branch} -->

<script>
    let svg = `w-24 h-24 mb-2`
    let span = `font-semibold text-2xl`
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-8">
    <a href="/dashboard/products" class="rounded-xl shadow-lg p-6 bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-500 text-white flex flex-col items-center hover:scale-105 transition-transform">
        <svg class={svg} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 7h18M3 12h18M3 17h18"/></svg>
        <span class={span}>Products</span>
    </a>
    <a href="/dashboard/appointments" class="rounded-xl shadow-lg p-6 bg-gradient-to-br from-green-400 via-teal-400 to-blue-500 text-white flex flex-col items-center hover:scale-105 transition-transform">
        <svg class={svg} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        <span class={span}>Appointments</span>
    </a>
    <a href="/dashboard/supplies" class="rounded-xl shadow-lg p-6 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 text-white flex flex-col items-center hover:scale-105 transition-transform">
        <svg class={svg} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0H4"/></svg>
        <span class={span}>Supplies</span>
    </a>
    <a href="/dashboard/customers" class="rounded-xl shadow-lg p-6 bg-gradient-to-br from-cyan-400 via-blue-400 to-purple-500 text-white flex flex-col items-center hover:scale-105 transition-transform">
        <svg class={svg} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 20h5v-2a4 4 0 00-3-3.87M9 20h6M3 20h5v-2a4 4 0 013-3.87M16 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
        <span class={span}>Customers</span>
    </a>
</div>


