<script>
	import { enhance } from "$app/forms";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
	import { Trash } from "@lucide/svelte";
     import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
    let isOpen = $state(false);

</script>
 
<Dialog.Root bind:open={isOpen}>
 <Dialog.Trigger  class={buttonVariants({ variant: "destructive" })}
  ><Trash /> Delete </Dialog.Trigger
 >
 <Dialog.Content class="w-full">
  <Dialog.Header>
   <Dialog.Title>Delete</Dialog.Title>
  </Dialog.Header>
  <ScrollArea class="h-auto rounded-md border p-2">
   <h5 class="text-center">Are you sure you want to Delete? This action is irreversable</h5>
 <div class="flex flex-row justify-center gap-4 items-center pt-4" >
     <form action="?/delete"  method="post"
     use:enhance >
   <Button type="submit" size="lg" variant="destructive"> Delete <Trash /></Button>
</form>

  <Button onclick={() => (isOpen = false)} size="lg">Cancel</Button>
  </div>
  </ScrollArea>
 </Dialog.Content>
</Dialog.Root>