<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import AppSidebar from "$lib/components/app-sidebar.svelte";
	import DarkMode from "$lib/components/DarkMode.svelte";
	import Search from "$lib/components/Search.svelte";
	import AvatarSettings from "$lib/components/AvatarSettings.svelte";
	import Logout from "$lib/forms/Logout.svelte";
	import BottomMenu from "$lib/components/bottomMenu.svelte";

  let { children, data } = $props();
</script>


<Sidebar.Provider>
  <AppSidebar />
  <main class="w-full mx-2 ">
    <div class="absolute z-100 top-2 left-2 shadow-lg backdrop-blur-md p-2 lg:pr-0 pr-4 rounded-lg lg:sticky align-middle w-full flex flex-row justify-between">
    <Sidebar.Trigger class="p-4 rounded-lg bg-white dark:bg-black" />
    <div class="flex flex-row gap-4 items-center">
    <Search />
    <DarkMode />
    <AvatarSettings data={data?.role?.name} />
 
</div>
  
    </div>
    <div class="p-4 lg:pb-4 pb-24 lg:pt-4 pt-24">
      {@render children?.()}
    </div>
    
  </main>
</Sidebar.Provider>
<BottomMenu />
