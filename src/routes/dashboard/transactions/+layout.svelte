<script>
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button/button.svelte';

	import { Plus } from '@lucide/svelte';
	let { children } = $props();
</script>

<div class="mb-8 flex flex-row items-center justify-start gap-2">
	<Button
		href="/dashboard/transactions/expenses/add-expenses"
		variant={page.url.pathname === '/dashboard/staff/add-staff' ? 'default' : 'outline'}
		><Plus /> Add Expenses</Button
	>
	<Button
		href="/dashboard/transactions/expenses/add-expense-category"
		variant={page.url.pathname === '/dashboard/transactions/expenses/add-expense-category'
			? 'default'
			: 'outline'}><Plus /> Add Expense Category</Button
	>
</div>

{@render children()}
