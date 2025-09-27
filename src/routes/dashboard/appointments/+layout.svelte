<script>
    import Button from "$lib/components/ui/button/button.svelte";
	import { Plus } from "@lucide/svelte";
    let { children } = $props();
</script>
<div class="mb-8 flex justify-start">
<Button href="/dashboard/appointments/add-appointment"><Plus />Add an Appointment</Button>
</div>

{@render children()}