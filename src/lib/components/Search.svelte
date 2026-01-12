<script>
	import * as Command from '$lib/components/ui/command/index.js';
	import { Disc, Search } from '@lucide/svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	let isOpen = $state(false);
	let list = [
		{ label: 'Dashboard', path: '/dashboard' },
		{ label: 'Change Password', path: '/dashboard/change-password' },

		{ label: 'Admin Panel', path: '/dashboard/admin-panel' },
		{ label: 'Add Positions', path: '/dashboard/admin-panel/add-positions' },
		{ label: 'Add Product Category', path: '/dashboard/admin-panel/add-product-category' },
		{ label: 'Add Roles', path: '/dashboard/admin-panel/add-roles' },
		{ label: 'Add Services (Admin)', path: '/dashboard/admin-panel/add-services' },
		{ label: 'Add Users (Admin)', path: '/dashboard/admin-panel/add-users' },
		{ label: 'Payment Methods', path: '/dashboard/admin-panel/payment-methods' },
		{ label: 'Roles', path: '/dashboard/admin-panel/roles' },
		{ label: 'Add Role', path: '/dashboard/admin-panel/roles/add-roles' },
		{ label: 'Role Details', path: '/dashboard/admin-panel/roles/:id' },

		{ label: 'Appointments', path: '/dashboard/appointments' },
		{ label: 'Add Appointment', path: '/dashboard/appointments/add-appointment' },
		{ label: 'All Appointments', path: '/dashboard/appointments/all-appointments' },
		{ label: 'Appointments by Range', path: '/dashboard/appointments/all-appointments/:range' },
		{ label: 'Appointment Details', path: '/dashboard/appointments/single/:id' },
		{ label: 'Appointments by Date', path: '/dashboard/appointments/:date' },

		{ label: 'Customers', path: '/dashboard/customers' },

		{ label: 'Products', path: '/dashboard/products' },
		{ label: 'Add Product', path: '/dashboard/products/add-products' },
		{ label: 'Product Categories', path: '/dashboard/products/categories' },

		{ label: 'Reports', path: '/dashboard/reports' },
		{ label: 'Reports by Range', path: '/dashboard/reports/:range' },

		{ label: 'Salary', path: '/dashboard/salary' },

		{ label: 'Sales', path: '/dashboard/sales' },

		{ label: 'Services', path: '/dashboard/services' },
		{ label: 'Add Service', path: '/dashboard/services/add-services' },
		{ label: 'Service Categories', path: '/dashboard/services/categories' },

		{ label: 'Staff', path: '/dashboard/staff' },
		{ label: 'Add Staff', path: '/dashboard/staff/add-staff' },
		{ label: 'Positions', path: '/dashboard/staff/positions' },
		{ label: 'Staff Ranges', path: '/dashboard/staff/ranges/:range' },

		{ label: 'Supplies', path: '/dashboard/supplies' },
		{ label: 'Add Supplies', path: '/dashboard/supplies/add-supplies' },
		{ label: 'Supply Details', path: '/dashboard/supplies/:id' },

		{ label: 'Transactions', path: '/dashboard/transactions' },
		{ label: 'Expenses', path: '/dashboard/transactions/expenses' },
		{ label: 'Add Expense', path: '/dashboard/transactions/expenses/add-expense' },
		{
			label: 'Add Expense Category',
			path: '/dashboard/transactions/expenses/add-expense-category'
		},
		{ label: 'Expense Details', path: '/dashboard/transactions/expenses/single/:id' },

		{ label: 'Users', path: '/dashboard/users' },
		{ label: 'Add User', path: '/dashboard/users/add-users' }
	];
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Trigger class="w-auto px-4" title="Search for Pages"><Search /></Dialog.Trigger>
	<Dialog.Content class="w-full">
		<Dialog.Header>
			<Dialog.Title>Search the whole site</Dialog.Title>
		</Dialog.Header>
		<ScrollArea class="h-auto rounded-md border p-2">
			<h5 class="text-center">Search Anything</h5>
			<Command.Root class="rounded-lg shadow-md md:min-w-[450px]">
				<Command.Input placeholder="Type a command or search..." type="search" />
				<Command.List>
					<Command.Empty>No results found.</Command.Empty>
					<Command.Group heading="Suggestions">
						{#each list as item (item.path)}
							<Command.Item>
								<Disc />
								<a href={item.path} onclick={() => (isOpen = false)}>{item.label}</a>
							</Command.Item>
						{/each}
					</Command.Group>
				</Command.List>
			</Command.Root>
		</ScrollArea>
	</Dialog.Content>
</Dialog.Root>
