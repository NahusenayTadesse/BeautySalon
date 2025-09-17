<script lang="ts">
 import CheckIcon from "@lucide/svelte/icons/check";
 import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
 import { tick } from "svelte";
 import * as Command from "$lib/components/ui/command/index.js";
 import * as Popover from "$lib/components/ui/popover/index.js";
 import { Button } from "$lib/components/ui/button/index.js";
 import { cn } from "$lib/utils.js";
	import { selectItem } from "$lib/global.svelte";
 

  let { items, name,value=$bindable(), btnName = "Select from Existing Parents" } = $props();
 let open = $state(false);
 let triggerRef = $state<HTMLButtonElement>(null!);
 
 const selectedValue = $derived(
  items.find((f) => f.value === value)?.name
 );
 
 // We want to refocus the trigger button when the user selects
 // an item from the list so users can continue navigating the
 // rest of the form with the keyboard.
 function closeAndFocusTrigger() {
  open = false;
  tick().then(() => {
   triggerRef.focus();
  });
 }
</script>
 
<Popover.Root bind:open>
 <Popover.Trigger bind:ref={triggerRef}>
  {#snippet child({ props })}
   <Button
    {...props}
    variant="outline"
    class="w-full justify-between capitalize"
    role="combobox"
    aria-expanded={open}
   >
    {selectedValue || "Select " + name + "..."}
    <ChevronsUpDownIcon class="opacity-50" />
   </Button>
  {/snippet}
 </Popover.Trigger>
 <input type="hidden" bind:value {name} /> 

 <Popover.Content class="w-full p-0">
  <Command.Root>
   <Command.Input placeholder="Search {name}..." />
   <Command.List>
    <Command.Empty>No {name} found.</Command.Empty>
    <Command.Group >
     {#each items as  item}
      <Command.Item
       value={item.name}        
    keywords={[item.name]}    
    onSelect={() => {
      value = item.value;     
      closeAndFocusTrigger();
    }}
     class={selectItem}
      >
       <CheckIcon
        class={cn(value !== item.value && "text-transparent")}
       />
       {item.name}
      </Command.Item>
     {/each}
    </Command.Group>
   </Command.List>
  </Command.Root>
 </Popover.Content>
</Popover.Root>