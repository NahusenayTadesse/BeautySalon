<script lang="ts">
 import EllipsisIcon from "@lucide/svelte/icons/ellipsis";
 import { Button } from "$lib/components/ui/button/index.js";
 import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
 
 let { id,  recieptLink, customerName, date, booker }:
  { id: string, booker: string, recieptLink: string, customerName: string, date: string } = $props();
</script>
 
<DropdownMenu.Root>
 <DropdownMenu.Trigger>
  {#snippet child({ props })}
   <Button
    {...props}
    variant="ghost"
    size="icon"
    class="relative size-8 p-0"
   >
    <span class="sr-only">Open menu</span>
    <EllipsisIcon />
   </Button>
  {/snippet}
 </DropdownMenu.Trigger>
 <DropdownMenu.Content>
  <DropdownMenu.Group>
   <DropdownMenu.Label>Settings</DropdownMenu.Label>
  
  </DropdownMenu.Group>
  <DropdownMenu.Separator />

  <DropdownMenu.Item><a href="/dashboard/user/{id}" > Check out Customer Profile</a></DropdownMenu.Item>
  <DropdownMenu.Item><a href="/dashboard/user/{booker}" > Check out Staff Profile</a></DropdownMenu.Item>
  <DropdownMenu.Item><a href="/dashboard/files/{recieptLink}" download="{customerName} Booking Reciept for {date} Appointment" >Dowload Reciept</a></DropdownMenu.Item>

 </DropdownMenu.Content>
</DropdownMenu.Root>