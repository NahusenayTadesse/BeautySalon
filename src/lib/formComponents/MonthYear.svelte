<script lang="ts">
	import { getLocalTimeZone, today } from "@internationalized/date";
	import { Button } from "$lib/components/ui/button";
	import { Popover, PopoverContent, PopoverTrigger } from "$lib/components/ui/popover";
	import { ChevronLeftIcon, ChevronRightIcon } from "@lucide/svelte";
	import type { CalendarDate } from "@internationalized/date";

	let { value = $bindable(today(getLocalTimeZone())), mode = "month" }: Props = $props();

	let isOpen = $state(false);
	let displayMonth = $state(value.month);
	let displayYear = $state(value.year);

	const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	const years = Array.from({ length: 20 }, (_, i) => displayYear - 10 + i);

	const selectMonth = (month: number) => {
		displayMonth = month;
		if (mode === "month") {
			value = value.set({ month });
			isOpen = false;
		}
	};

	const selectYear = (year: number) => {
		displayYear = year;
		if (mode === "year") {
			value = value.set({ year });
			isOpen = false;
		}
	};

	const previousYear = () => {
		displayYear -= 10;
	};

	const nextYear = () => {
		displayYear += 10;
	};

	type Props = {
		value?: CalendarDate;
		mode?: "month" | "year";
	};
</script>

<Popover bind:open={isOpen}>
	<PopoverTrigger>
		<Button variant="outline" class="w-full justify-start text-left font-normal">
			{#if mode === "month"}
				{months[value.month - 1]} {value.year}
			{:else}
				{value.year}
			{/if}
		</Button>
	</PopoverTrigger>
	<PopoverContent class="w-72 p-0" align="start">
		<div class="flex flex-col gap-4 p-4">
			{#if mode === "month"}
				<div>
					<h3 class="mb-3 text-sm font-semibold text-center">{displayYear}</h3>
					<div class="grid grid-cols-3 gap-2">
						{#each months as month, index}
							<Button variant={displayMonth === index + 1 ? "default" : "outline"} size="sm" class="h-8" onclick={() => selectMonth(index + 1)}>
								{month}
							</Button>
						{/each}
					</div>
				</div>
				<div class="flex items-center justify-between pt-2 border-t">
					<Button variant="ghost" size="sm" onclick={() => (displayYear -= 1)}>
						<ChevronLeftIcon class="size-4" />
					</Button>
					<span class="text-sm font-medium">{displayYear}</span>
					<Button variant="ghost" size="sm" onclick={() => (displayYear += 1)}>
						<ChevronRightIcon class="size-4" />
					</Button>
				</div>
			{:else}
				<div>
					<div class="flex items-center justify-between mb-3">
						<Button variant="ghost" size="sm" onclick={previousYear}>
							<ChevronLeftIcon class="size-4" />
						</Button>
						<span class="text-sm font-semibold">{displayYear - 10} - {displayYear + 9}</span>
						<Button variant="ghost" size="sm" onclick={nextYear}>
							<ChevronRightIcon class="size-4" />
						</Button>
					</div>
					<div class="grid grid-cols-4 gap-2">
						{#each years as year}
							<Button variant={value.year === year ? "default" : "outline"} size="sm" class="h-8" onclick={() => selectYear(year)}>
								{year}
							</Button>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</PopoverContent>
</Popover>
