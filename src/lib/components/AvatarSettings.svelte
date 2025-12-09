<script lang="ts">
 import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
   import * as Avatar from "$lib/components/ui/avatar/index.js";
     import { Button, buttonVariants } from "$lib/components/ui/button/index.js";

	import { LogOut } from "@lucide/svelte";
	import { enhance } from "$app/forms";
	import LoadingBtn from "$lib/formComponents/LoadingBtn.svelte";
   let { data }: {data: string | undefined} = $props();
   
    let deleting = $state(false);

</script>
<DropdownMenu.Root>
 <DropdownMenu.Trigger>
      <Avatar.Root> 
    <Avatar.Fallback class="flex items-center justify-center  rounded-full text-white font-medium bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-800 dark:via-purple-700 dark:to-pink-800 border-0">
      {data?.[0].toUpperCase()}
    </Avatar.Fallback>
    </Avatar.Root>

 </DropdownMenu.Trigger>
 <DropdownMenu.Content>
  <DropdownMenu.Group>
   <DropdownMenu.Label>My Account</DropdownMenu.Label>
   <DropdownMenu.Separator />
   <!-- <DropdownMenu.Item >
    <a href="/dashboard/users/change-password">Change Password</a>

</DropdownMenu.Item> -->
   <DropdownMenu.Item > <form
  method="post"
  action="/dashboard/?/logout"
  use:enhance={() => {
    deleting = true;                        // 1. start spinner

    return async ({ update }) => {
      await update();                       // 2. apply action result to page
      deleting = false;                     // 3. stop spinner

    };
  }}
>

  <button
    type="submit"
    disabled={deleting}
    class="flex flex-row gap-2 justify-center items-center"
    
  >
    {#if deleting}
      <LoadingBtn name="Logging Out" />
    {:else}
      <LogOut class="" /> Logout
    {/if}
  </button>
</form></DropdownMenu.Item>
  </DropdownMenu.Group>
 </DropdownMenu.Content>
</DropdownMenu.Root>