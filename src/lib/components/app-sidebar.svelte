<script lang="ts">
	import {  Users, UserRoundCog, ChartArea, Hexagon,Calendar, Package, SquareChartGantt, IdCardLanyard, LayoutDashboard, ShoppingBasket, Container } from '@lucide/svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';
	import { page } from '$app/state';
	import DarkMode from './DarkMode.svelte';
	import { bgGradient, selectItem } from '$lib/global.svelte';
	import { fade, slide } from 'svelte/transition';
	const navigation = 	[
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Customers', url: '/dashboard/customers', icon: Users },
  { title: 'Appointments', url: '/dashboard/appointments', icon: Calendar },
  { title: 'Products', url: '/dashboard/products', icon: ShoppingBasket },
  { title: 'Services', url: '/dashboard/services', icon: SquareChartGantt },
  { title: 'Supplies', url: '/dashboard/supplies', icon: Container },
  { title: 'Reports', url: '/dashboard/reports', icon: ChartArea },
  { title: 'Staff', url: '/dashboard/staff', icon: IdCardLanyard },
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

	
	let open = $state(false)
</script>

<!-- <Sidebar.Root collapsible="icon" {...restProps} >
	<Sidebar.Header class={bgGradient}>
		<Sidebar.Menu class={bgGradient}>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton class="data-[slot=sidebar-menu-button]:!p-1.5">
					{#snippet child({ props })}
						<a href="##" {...props}>
							<Hexagon class="!size-5" />
							<span class="text-base font-semibold">Acme Inc.</span>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content class={bgGradient}>
		<ul class="mt-8 flex w-full flex-col items-start justify-center gap-2 p-2">
			<li class="w-full">
					<a
						href="/dashboard"
						class="text-md flex items-center gap-3 rounded-lg px-3 py-3
          font-medium transition-colors duration-300 hover:bg-sidebar-accent
          hover:text-sidebar-accent-foreground
          {page.url.pathname === '/dashboard' ? 
		    
							'bg-sidebar-primary text-sidebar-primary-foreground'
							: 'text-sidebar-foreground'}"
					>
						<LayoutDashboard class="h-4 w-4" />
						Dashboard
						  
					</a>
				</li>
			{#each navigation as item}
				<li class="w-full">
					{#snippet child({ props })}

					<a
						href={item.url}
						class="text-md flex items-center gap-3 rounded-lg px-3 py-3
          font-medium transition-colors duration-300 hover:bg-sidebar-accent
          hover:text-sidebar-accent-foreground
          {page.url.pathname === item.url || page.url.pathname.startsWith(item.url + '/') ? 
		    
							'bg-sidebar-primary text-sidebar-primary-foreground'
							: 'text-sidebar-foreground'}"
					
					  {...props}
					 >
						<item.icon class="h-4 w-4"  />
						{item.title}
						  
					</a>
					{/snippet}
				</li>
			{/each}
		</ul>
	</Sidebar.Content>
	<Sidebar.Footer class="bg-white dark:bg-black">
		<DarkMode />
	</Sidebar.Footer>
</Sidebar.Root> -->


<Sidebar.Root collapsible='icon' {...restProps}>
  <Sidebar.Content class={bgGradient}>
    <Sidebar.Group>
      <Sidebar.GroupLabel > <div class="flex flex-row gap-4 py-8 items-center justify-center"> 
		<img src="/logo.png" class="w-8 h-8" alt="Logo" >
		 <h4 class="text-gray-900 dark:text-white"> NSS Marketing </h4> </div></Sidebar.GroupLabel>
      <Sidebar.GroupContent class="mt-8">
        <Sidebar.Menu class="w-full gap-3">
          {#each navigation as item (item.title)}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton class="text-lg flex items-center gap-3 rounded-lg px-3 py-6
          font-normal transition-colors duration-300 hover:bg-sidebar-accent
          hover:text-sidebar-accent-foreground {selectItem}
          {blacken(item.url)}">
                {#snippet child({ props })}
                  <a href={item.url}
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
  	<Sidebar.Footer class="bg-white dark:bg-black">
		<DarkMode />
	</Sidebar.Footer>
</Sidebar.Root>