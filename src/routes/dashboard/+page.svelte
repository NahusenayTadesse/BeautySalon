<script lang="ts">
	import AppointmentCard from "$lib/components/dashboard/appointment-card.svelte";
	import ReorderList from "$lib/components/dashboard/reorder-list.svelte";
	import ReportSection from "$lib/components/dashboard/report-section.svelte";
	import { PackageIcon, BoxIcon } from "@lucide/svelte";
	import { columns } from "./columns";
	import DataTable from "$lib/components/Table/data-table.svelte";


	let { data} = $props();
	
	
</script>
 <svelte:head>
	<title>Dashboard</title>
 </svelte:head>


<div class="min-h-dvh mt-16 rounded-lg w-full bg-gradient-to-br from-background/10 via-background/10 to-muted/30
 backdrop-blur-md border transition-colors duration-300">
	<!-- Header Section -->
	<div class="border-b border-border/50 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5
	 rounded-xl backdrop-blur-sm shadow-sm">
		<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between">
				<div class="space-y-1">
					<h1 class="text-3xl font-bold bg-gradient-to-r from-primary to-black dark:to-white bg-clip-text text-transparent">Dashboard</h1>
					<p class="text-sm text-muted-foreground">Welcome back! Here's your daily overview.</p>
				</div>
				
			</div>
		</div>
	</div>

	<!-- Main Content -->
	<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<ReportSection>
			<div class="flex flex-col gap-4">
				<div class="rounded-lg border border-border/50 bg-muted/30 p-2 text-center">
					       <DataTable data={data.todayReport} {columns} search={false}/>

				</div>
			
			</div>
		</ReportSection>
		<!-- Stats Grid -->
		<div class="grid gap-6 mb-8">
			<AppointmentCard count={data.nofAppointments} />
		</div>

		<!-- Reorder Items Grid -->
		<div class="grid gap-6 md:grid-cols-2 mb-8">
			<ReorderList title="Products to Reorder" description="Items below reorder level" items={data.reorderProducts} icon={PackageIcon} />
			<ReorderList title="Supplies to Reorder" description="Items below reorder level" items={data.reorderSupplies} icon={BoxIcon} />
		</div>

		<!-- Report Section -->
		
	</div>
</div>

