<script lang="ts">
    let { status }: { status: string } = $props();
</script>


<span class="px-2 py-1 rounded-full text-white text-sm font-medium" class:bg-yellow-500={status === 'Pending'} class:bg-blue-500={status === 'Confirmed'} class:bg-green-500={status === 'Completed'} class:bg-red-500={status === 'Cancelled'}>        
    {status}
</span>