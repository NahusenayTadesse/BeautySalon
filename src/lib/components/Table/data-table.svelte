<script lang="ts" generics="TData, TValue">
 import { type ColumnDef,
     getCoreRowModel, getPaginationRowModel, type ColumnFilter, ColumnFiltering,
     getSortedRowModel, getFilteredRowModel, type PaginationState,
      type SortingState, type ColumnFiltersState, type VisibilityState,
	  type GlobalFilterColumn} from "@tanstack/table-core";

    import { Input } from '$lib/components/ui/input/index.js';

 
        import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";

    
let { data, columns, search = true }: DataTableProps<TData, TValue> = $props();
// let filterSchema = $derived(
//   discoverFilterSchema(data).filter(meta => !filterBlacklist.includes(meta.key))
// );  import { Input } from "$lib/components/ui/input/index.js";

 import {
  createSvelteTable,
  FlexRender,
 } from "$lib/components/ui/data-table/index.js";
   import * as Table from "$lib/components/ui/table/index.js";
   import { Button } from "$lib/components/ui/button/index.js";
	import { ChevronDownIcon, Frown } from "@lucide/svelte";

   let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
  let columnFilters = $state<ColumnFiltersState>([]);


type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  search?: boolean;
  filterBlacklist?: string[]; // <-- new
};
 
 let sorting = $state<SortingState>([]);
 let globalFilter = $state<GlobalFilterColumn>();
      
  let columnVisibility = $state<VisibilityState>({});


 
 const table = createSvelteTable({
  get data() {
   return data;
  },
  columns,
   state: {
      get pagination() {
        return pagination;
      },
       get sorting() {
        return sorting;
      },
      get columnFilters() {
        return columnFilters;
      },  
       get columnVisibility() {
        return columnVisibility;
      },
      
      get globalFilter() {
        return globalFilter
      }
       
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        pagination = updater(pagination);
      } else {
        pagination = updater;
      }
    },
    onSortingChange: (updater) => {
      if (typeof updater === "function") {
        sorting = updater(sorting);
      } else {
        sorting = updater;
      }
    },
    onColumnFiltersChange: (updater) => {
      if (typeof updater === "function") {
        columnFilters = updater(columnFilters);
      } else {
        columnFilters = updater;
      }
    },
    onColumnVisibilityChange: (updater) => {
      if (typeof updater === "function") {
        columnVisibility = updater(columnVisibility);
      } else {
        columnVisibility = updater;
      }
    },

   getCoreRowModel: getCoreRowModel(),
   getPaginationRowModel: getPaginationRowModel(),
   getSortedRowModel: getSortedRowModel(),
   getFilteredRowModel: getFilteredRowModel(),

 });

 
</script>
 <div class="lg:w-full w-full bg-white rounded-lg dark:bg-gray-950 p-2">
<div class="rounded-md min-w-full border-0">
      {#if search}
        <div class="py-4">
    <!-- <Filters
      schema={filterSchema}
      filters={columnFilters}
      onChange={f => (columnFilters = f)}
    /> -->
  </div>
      <div class="flex flex-row gap-4 items-center py-4">
         
    <Input
      type="text"      
      placeholder="Search Table..."
      class="w-2/3"
      bind:value={globalFilter}
      oninput={()=>table.setGlobalFilter(globalFilter)}
    />

    

   

    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {#snippet child({ props })}
          <Button {...props} variant="outline" class="ml-auto">Columns <ChevronDownIcon class="size-5" />
</Button>
        {/snippet}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
      {#each table
          .getAllColumns()
          .filter((col) => col.getCanHide()) as column (column)}
          <DropdownMenu.CheckboxItem
            class="capitalize"
            bind:checked={
              () => column.getIsVisible(), (v) => column.toggleVisibility(!!v)
            }
          >
            
            {column.id.replace(/([a-z])([A-Z])/g, '$1 $2')}
          </DropdownMenu.CheckboxItem>
        {/each}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>
  {/if}
    <div class="border rounded-md">

 <Table.Root>
  <Table.Header>
   {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
    <Table.Row >
     {#each headerGroup.headers as header (header.id)}
      <Table.Head colspan={header.colSpan} class="text-start p-0 pr-2" >
       {#if !header.isPlaceholder}
        <FlexRender
         
         content={header.column.columnDef.header}
         context={header.getContext()}
        />
       {/if}

      </Table.Head>
     {/each}
    </Table.Row>
   {/each}
  </Table.Header>
  <Table.Body>
   {#each table.getRowModel().rows as row (row.id)}
    <Table.Row data-state={row.getIsSelected() && "selected"}>
     {#each row.getVisibleCells() as cell (cell.id)}
      <Table.Cell class="capitalize">
       <FlexRender
        
        content={cell.column.columnDef.cell}
        context={cell.getContext()}
       />
      </Table.Cell>
     {/each}
    </Table.Row>
   {:else}
    <Table.Row>
     <Table.Cell colspan={columns.length} class="text-center font-2xl">
        <div class="flex flex-row items-center justify-center gap-2"><Frown class="animate-bounce" /> Nothing found here.</div>
     </Table.Cell>
    </Table.Row>
   {/each}
  </Table.Body>
 </Table.Root>
 </div>
  {#if table.getPageCount() > 1}
  <div class="flex items-center justify-end space-x-2 py-4">
    <Button
      variant="outline"
      size="sm"
      onclick={() => table.previousPage()}
      disabled={!table.getCanPreviousPage()}
    >
      Previous
    </Button>
    <Button
      variant="outline"
      size="sm"
      onclick={() => table.nextPage()}
      disabled={!table.getCanNextPage()}
    >
      Next
    </Button>
  </div>
  {/if}
</div>
</div>