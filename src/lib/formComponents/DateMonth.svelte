<script lang="ts">
  import RangeCalendar from "$lib/components/ui/range-calendar/range-calendar.svelte";
  import { CalendarDate } from "@internationalized/date";
	import { CalendarIcon, SlidersHorizontal } from "@lucide/svelte";
  import type { DateRange } from "bits-ui";
    import * as Popover from "$lib/components/ui/popover/index.js";

  import { cn } from "$lib/utils.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
	import Button from "$lib/components/ui/button/button.svelte";

  let value = $state<DateRange>({
    start: new CalendarDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()),
    end: new CalendarDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()),
  }); 

  let { id, link="/dashboard/staff" }: { id?: number, link: string } = $props();



    let open = $state(false);
   let contentRef = $state<HTMLElement | null>(null);


 
</script>
<Popover.Root bind:open>
  <Popover.Trigger
    class={cn(
      buttonVariants({
        variant: "outline",
        class: "w-[280px] justify-start text-start font-normal"
      }),
      !value && "text-muted-foreground"
    )}
  >
    <CalendarIcon />
{value
  ? (value.start ?? "Pick a start date") + " - " + (value.end ?? "Pick an end date")
  : "Pick a date"}
  </Popover.Trigger>
    <Popover.Content bind:ref={contentRef} class="w-auto p-0">

<RangeCalendar bind:value class="relative rounded-lg pb-4 w-auto border shadow-sm" numberOfMonths={2} />
<Button disabled={!value.start || !value.end} class="absolute right-0 bottom-0"
 href={`${link}/ranges/${value.start}-${value.end}-${id}`}
 onclick={()=>{
    open = false;
    }}> 
<SlidersHorizontal />    Filter
</Button>
  </Popover.Content>
</Popover.Root>

