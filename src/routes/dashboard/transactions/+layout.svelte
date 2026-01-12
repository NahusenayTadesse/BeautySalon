<script>
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button/button.svelte';

	import { Plus, Sheet } from '@lucide/svelte';
	let { data, children } = $props();
</script>

<div class="mb-8 flex flex-row items-center justify-start gap-2">
	{#if data?.permList?.some((p) => p.name === 'view:expenses')}
		<Button
			href="/dashboard/transactions/expenses"
			variant={page.url.pathname === '/dashboard/transactions/expenses' ? 'default' : 'outline'}
			><Sheet /> Expenses</Button
		>
	{/if}
	{#if data?.permList?.some((p) => p.name === 'add:expenses')}
		<Button
			href="/dashboard/transactions/expenses/add-expense"
			variant={page.url.pathname === '/dashboard/transactions/expenses/add-expense'
				? 'default'
				: 'outline'}><Plus /> Add Expense</Button
		>

		<Button
			href="/dashboard/transactions/expenses/add-expense-category"
			variant={page.url.pathname === '/dashboard/transactions/expenses/add-expense-category'
				? 'default'
				: 'outline'}><Plus /> Add Expense Category</Button
		>
	{/if}
</div>

{@render children()}
