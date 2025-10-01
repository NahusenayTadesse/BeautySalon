<script lang="ts">
    let { status }: { status: string } = $props();
      import { Badge } from "$lib/components/ui/badge/index.js";

    import { BadgeCheck, Loader, OctagonMinus} from "@lucide/svelte";

    
    
    let Icon = status === 'Confirmed' ?  BadgeCheck : status === 'Cancelled' ? OctagonMinus : Loader



</script>


<!-- <span class="px-2 py-1 rounded-full text-white text-sm font-medium" class:bg-red-500={status === 'Cancelled'}>        
   {status}
</span> -->
 <Badge variant="secondary" class="{status === 'Confirmed' ?  'bg-blue-500' : ''} {status === 'Cancelled' ? 'bg-red-500' : ''} {status === 'Pending' ? 'bg-yellow-500' : ''} text-white ">
      <Icon />
      {status}
    </Badge>
 