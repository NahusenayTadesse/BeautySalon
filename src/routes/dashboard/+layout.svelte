<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import AppSidebar from "$lib/components/app-sidebar.svelte";
 
  let { children } = $props();
</script>


<Sidebar.Provider>
  <AppSidebar />
  <main>
    <Sidebar.Trigger class="absolute top-2 left-2 lg:sticky" />
    <div class="p-4">
      {@render children?.()}
    </div>
    
  </main>
</Sidebar.Provider>
