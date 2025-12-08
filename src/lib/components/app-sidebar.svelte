<script lang="ts">
	import {  Users, UserRoundCog, ChartArea, Calendar, SquareChartGantt, IdCardLanyard, LayoutDashboard, ShoppingBasket, Container, Banknote, BanknoteArrowUp, Receipt, ArrowLeftRight, ScanLine } from '@lucide/svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';
	import { page } from '$app/state';
	import { bgGradient, selectItem } from '$lib/global.svelte';
	import { fade, scale } from 'svelte/transition';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	const navigation = 	[
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Customers', url: '/dashboard/customers', icon: Users },
  { title: 'Appointments', url: '/dashboard/appointments', icon: Calendar },
  { title: 'Products', url: '/dashboard/products', icon: ShoppingBasket },
  { title: 'Services', url: '/dashboard/services', icon: SquareChartGantt },
  { title: 'Supplies', url: '/dashboard/supplies', icon: Container },
  { title: 'Reports', url: '/dashboard/reports', icon: ChartArea },
  { title: 'Staff', url: '/dashboard/staff', icon: IdCardLanyard },
  { title: 'Salary', url: '/dashboard/salary', icon: Banknote },
  { title: 'Sales', url: '/dashboard/sales', icon: BanknoteArrowUp },
  { title: 'Transactions', url: '/dashboard/transactions', icon: ScanLine },
  { title: 'Admin Panel', url: '/dashboard/admin-panel', icon: UserRoundCog}
]
   
	let { ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();


    

	const on = 'bg-sidebar-primary text-sidebar-primary-foreground'
	const off = 'text-sidebar-foreground'
	function blacken(url: string) {
    const currentPath = page.url.pathname;
    
    // Special case for root dashboard
    if (url === '/dashboard') {
        return currentPath === '/dashboard' ? on : off;
    }
    
    // For other items, check if current path starts with their URL but is not just /dashboard
    return currentPath.startsWith(url) && currentPath !== '/dashboard' ? on : off;
}

	
	let open = $state(false);


 
	 const sidebar = useSidebar();

  function closeSidebar() {
    if (sidebar.isMobile) {
      sidebar.setOpenMobile(false);
    } 
  }

</script>


      


<Sidebar.Root collapsible='icon' {...restProps} >
  <Sidebar.Content  class={bgGradient}>
    <Sidebar.Group>
      <Sidebar.GroupLabel > <div class="flex flex-row gap-4 py-8 items-center justify-center"> 
		<img src="/logo.png" class="w-8 h-8" alt="Logo" >
		 <h4 class="text-gray-900 dark:text-white !text-[22px]"> Suna Marketing </h4> </div></Sidebar.GroupLabel>
      <Sidebar.GroupContent class="mt-8">
        <Sidebar.Menu class="w-full gap-3">
          {#each navigation as item (item.title)}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton class="text-lg flex items-center gap-3 rounded-lg px-3 py-5
          font-normal transition-colors duration-300 hover:bg-sidebar-accent
          hover:text-sidebar-accent-foreground {selectItem}
          {blacken(item.url)}">
                {#snippet child({ props })}
                  <a href={item.url} 
				  onclick={closeSidebar}
				  {...props} transition:fade>
                    <item.icon class="!w-5 !h-5" />
                    <span>{item.title}</span>
					
			  </a>
                {/snippet}
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          {/each}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  </Sidebar.Content>
  	<Sidebar.Footer class="bg-white dark:bg-black flex flex-row">
		<Sidebar.GroupLabel>
		Powered By  <a href="https://sunamarketing.com" target="_blank" class="ml-1">Suna Marketing</a>
		</Sidebar.GroupLabel>
	</Sidebar.Footer>
</Sidebar.Root>