<script>
	import AdminNavCard from '$lib/components/AdminCard.svelte';
	let menus = [
		{ name: 'Services', href: '/dashboard/admin-panel/add-services' },
		{ name: 'Product Categories', href: '/dashboard/admin-panel/add-product-category' },
		{ name: 'Staff Positions', href: '/dashboard/admin-panel/add-positions' },
		{ name: 'Payment Methods', href: '/dashboard/admin-panel/payment-methods' }
	];

	let users = [
		{ name: 'Users', href: '/dashboard/admin-panel/add-users' },
		{ name: 'Roles', href: '/dashboard/admin-panel/roles' }
	];
</script>

<svele:head>
	<title>Admin Panel</title>
</svele:head>

<div class="min-h-dvh w-full text-foreground transition-colors duration-300">
	<!-- Header -->

	<!-- Main Content -->
	<main class="mx-auto max-w-7xl px-6 py-12">
		<!-- Hero Section -->
		<div class="mb-16 flex flex-col gap-4">
			<h2 class="text-4xl font-bold tracking-tight">Welcome to Admin Dashboard</h2>
			<p class="max-w-2xl text-lg text-muted-foreground">
				Manage locations, organizational structure, and user access. Select a category below to get
				started.
			</p>
		</div>

		<!-- Navigation Cards Grid -->
		<div class="grid gap-8 md:grid-cols-2">
			<AdminNavCard
				title="Locations"
				description="Manage geographic regions, cities, and subcities"
				icon="MapPin"
				items={menus}
				accentColor="from-emerald-500/15 to-emerald-500/5"
			/>

			<AdminNavCard
				title="Organization"
				description="Configure departments and payment methods"
				icon="Building2"
				items={users}
				accentColor="from-blue-500/15 to-blue-500/5"
			/>
		</div>
	</main>

	<!-- Footer -->
	<footer class="mt-16 border-t border-border/50 bg-card/50 py-8">
		<div class="mx-auto max-w-7xl px-6 text-center text-sm text-muted-foreground">
			<p>© 2024 Admin Panel. All rights reserved.</p>
		</div>
	</footer>
</div>
