<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import AppSidebar from "$lib/components/app-sidebar.svelte";
	import DarkMode from "$lib/components/DarkMode.svelte";
    import * as Avatar from "$lib/components/ui/avatar/index.js";

  let { children, data } = $props();
</script>


<Sidebar.Provider>
  <AppSidebar />
  <main class="w-full mx-2">
    <div class="absolute top-2 left-2 shadow-lg backdrop-blur-md p-2 rounded-lg lg:sticky align-middle w-full flex flex-row justify-between">
    <Sidebar.Trigger class="p-4 rounded-lg bg-white dark:bg-black" />
    <div class="flex flex-row gap-4 items-center">
    <DarkMode />
    <Avatar.Root> 
     <Avatar.Fallback class="bg-white dark:bg-black text-black dark:text-white border-1 dark:border-white border-black">{data.role?.name[0].toUpperCase()}</Avatar.Fallback>
</Avatar.Root>
</div>
  
    </div>
    <div class="p-4">
      {@render children?.()}
    </div>
    
  </main>
</Sidebar.Provider>
