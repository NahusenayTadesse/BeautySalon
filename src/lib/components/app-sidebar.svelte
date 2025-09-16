<script lang="ts">
	import { Settings, Users, ChartArea, Hexagon, Home, Calendar, Package } from '@lucide/svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';
	import { page } from '$app/state';
	import DarkMode from './DarkMode.svelte';
	import { bgGradient } from '$lib/global.svelte';
	const navigation = [
		{ name: 'Dashboard', href: '/', icon: Home },
		{ name: 'Customers', href: '/customers', icon: Users },
		{ name: 'Appointments', href: '/appointments', icon: Calendar },
		{ name: 'Inventory', href: '/inventory', icon: Package },
		{ name: 'Reports', href: '/reports', icon: ChartArea },
		{ name: 'Settings', href: '/settings', icon: Settings }
	];
	let { ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root collapsible="offcanvas" {...restProps}>
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
			{#each navigation as item}
				<li class="w-full">
					<a
						href={item.href}
						class="text-md flex items-center gap-3 rounded-lg px-3 py-3
          font-medium transition-colors duration-300 hover:bg-sidebar-accent
          hover:text-sidebar-accent-foreground
          {page.url.pathname === item.href
							? 'bg-sidebar-primary text-sidebar-primary-foreground'
							: 'text-sidebar-foreground'}"
					>
						<item.icon class="h-4 w-4" />
						{item.name}
					</a>
				</li>
			{/each}
		</ul>
	</Sidebar.Content>
	<Sidebar.Footer class="bg-white dark:bg-black">
		<DarkMode />
	</Sidebar.Footer>
</Sidebar.Root>
