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
  /* size tokens */
  const svg = 'w-32 h-32 mb-4 drop-shadow-lg';
  const span = 'font-extrabold text-4xl tracking-tight';
</script>

<!-- quick custom keyframe -->
<style>
  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  .shimmer {
    background-size: 200% 100%;
    animation: shimmer 2.5s infinite linear;
  }
  .card {
    transform-style: preserve-3d;
    transition: transform .35s ease, box-shadow .35s ease;
  }
  .card:hover {
    transform: perspective(1000px) rotateX(8deg) rotateY(-4deg) scale(1.08);
  }
</style>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 mt-12 px-6 max-w-6xl mx-auto justify-center items-center">
  <!-- Products -->
  <a href="/dashboard/products"
     class="card rounded-3xl shadow-2xl p-10 bg-gradient-to-br from-fuchsia-500 via-pink-500 to-rose-500 text-white flex flex-col items-center justify-center relative overflow-hidden">
    <!-- moving sheen -->
    <div class="absolute inset-0 shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
    <svg class={svg} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <path d="M3 7h18M3 12h18M3 17h18"/>
    </svg>
    <span class={span}>Products</span>
  </a>

  <!-- Appointments -->
  <a href="/dashboard/appointments"
     class="card rounded-3xl shadow-2xl p-10 bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-500 text-white flex flex-col items-center justify-center relative overflow-hidden">
    <div class="absolute inset-0 shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
    <svg class={svg} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
    </svg>
    <span class={span}>Appointments</span>
  </a>

  <!-- Supplies -->
  <a href="/dashboard/supplies"
     class="card rounded-3xl shadow-2xl p-10 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 text-white flex flex-col items-center justify-center relative overflow-hidden">
    <div class="absolute inset-0 shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
    <svg class={svg} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <path d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0H4"/>
    </svg>
    <span class={span}>Supplies</span>
  </a>

  <!-- Customers -->
  <a href="/dashboard/customers"
     class="card rounded-3xl shadow-2xl p-10 bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-600 text-white flex flex-col items-center justify-center relative overflow-hidden">
    <div class="absolute inset-0 shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
    <svg class={svg} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <path d="M17 20h5v-2a4 4 0 00-3-3.87M9 20h6M3 20h5v-2a4 4 0 013-3.87M16 7a4 4 0 11-8 0 4 4 0 018 0z"/>
    </svg>
    <span class={span}>Customers</span>
  </a>
</div>

