<script lang='ts'>
  

  let { data } = $props();
import { Input } from '$lib/components/ui/input/index.js';
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";

	import { Label } from '$lib/components/ui/label/index.js';
      import { getLocalTimeZone, today } from "@internationalized/date";
  import { Calendar } from "$lib/components/ui/calendar/index.js";
  import { CalendarDate } from "@internationalized/date";
  import { page } from '$app/state'
	import * as Card from '$lib/components/ui/card/index.js';

	import { goto } from '$app/navigation';
  import ChildrenTable from '$lib/ChildrenTable.svelte';
    import Button from "$lib/components/ui/button/button.svelte";
	import { CalendarDays } from '@lucide/svelte';

  let tableHeaders = [
    { name: 'Id', key: 'id' },
    { name: 'Name', key: 'customerName' },
    { name: 'Phone', key: 'phone' },
    { name: 'Booked By', key: 'bookedBy' },
    { name: 'Date', key: 'date' },
    { name: 'Time', key: 'time' },
    { name: 'Notes', key: 'notes' },
    { name: 'Booked At', key: 'bookedAt' }
  ]; 

  let todayDate = today(getLocalTimeZone());
  let value = $state<CalendarDate | undefined>(todayDate);
  

   
  let urlDate = $state(page.url.pathname.split('/').pop() || today(getLocalTimeZone()).toString());
    const [year, month, day] = urlDate.split("-").map(Number);

  let placeholder = $derived(todayDate);
  let open = $state(false);
   
</script>
 <div>
<Popover.Root bind:open>
  <Popover.Trigger  class={buttonVariants({ variant: "outline" })}>
    <CalendarDays /> Select Another Date</Popover.Trigger
  >
  <Popover.Content class="p-0">
<Card.Root>
  <Card.Header>
    <Card.Title>Appointment</Card.Title>
  </Card.Header>
  <Card.Content>
    <Calendar type="single"   bind:placeholder
 bind:value   onValueChange={() =>{ goto(`/dashboard/appointments/${value}`);
  open=false;}}
 class="bg-transparent p-0" />
  </Card.Content>
  <Card.Footer class="flex flex-wrap gap-2 border-t px-4 !pt-4">
    {#each [{ label: "Today", value: 0 }, { label: "Tomorrow", value: 1 }, { label: "In 3 days", value: 3 }, { label: "In a week", value: 7 }, { label: "In 2 weeks", value: 14 }] as preset (preset.value)}
      <Button
        variant="outline"
        size="sm"
        class="flex-1"
        onclick={() => {
          value = todayDate?.add({ days: preset.value });
          goto(`/dashboard/appointments/${value}`);
          open=false;

        }}
      >
        {preset.label}
      </Button>
    {/each}
  </Card.Footer>
</Card.Root>
 </Popover.Content>
</Popover.Root>

  
  </div>
  <div class="lg:w-full w-4/5 mt-8">
 {#if data.appointmentsList.length === 0}
   <p class="text-center">No appointments for this date.</p>
 {:else}
 <ChildrenTable {tableHeaders} mainlist={data.appointmentsList} search={true} link="appointments/single"  />
  {/if}
 </div> 