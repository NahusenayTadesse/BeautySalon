<script>
	import SingleTable from '$lib/components/SingleTable.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import EditGuarantor from './editGuarantor.svelte';
	import AddGuarantor from './addGuarantor.svelte';
	import SingleView from '$lib/components/SingleView.svelte';
</script>

<SingleView title="Guarantor Details">
	<div class="grid grid-cols-1 gap-4 wrap-break-word lg:grid-cols-2">
		<div class="flex flex-col gap-2">
			<h4 class="flex items-center gap-2">
				{#if data.guarantor}
					Guarantor Details
					{#key data?.guarantor}
						<EditGuarantor
							data={data?.editGuarantorForm}
							name={data?.guarantor?.name}
							phone={data?.guarantor?.phone}
							email={data?.guarantor?.email}
							relationship={data?.guarantor?.relationShip}
							relation={data?.guarantor?.relation}
							jobType={data?.guarantor?.jobType}
							company={data?.guarantor?.company}
							salary={data?.guarantor?.salary}
							photo={data?.guarantor?.photo}
							document={data?.guarantor?.document}
							govtId={data?.guarantor?.govtId}
							id={data?.guarantor?.id}
						/>
					{/key}
				{:else}
					No Guarantor!
					<AddGuarantor data={data?.addGuarantorForm} subcityList={data?.subcityList} />
				{/if}
			</h4>
			{#if data.guarantor}
				<SingleTable singleTable={employeeGuarantor} />
			{/if}
		</div>
		<div class="flex flex-col gap-2">
			<h4 class="flex items-center gap-2">
				{#if data?.guarantor?.address}
					<MapPin class="text-red-400" /> Guarantor Address
					{#key data?.guarantor}
						<EditAddress
							data={data?.addressForm}
							address={data?.guarantor?.address}
							subcityList={data?.subcityList}
						/>
					{/key}
				{/if}
			</h4>
			{#if data?.guarantor?.address}
				<SingleTable singleTable={guarantorAddress} />
			{/if}
		</div>
	</div>
	<div class="flex w-full flex-wrap items-center gap-2">
		{#if data?.guarantor?.photo}
			<Button
				variant="outline"
				href="/dashboard/files/{data?.guarantor?.photo}"
				target="_blank"
				rel="noopener noreferrer"
			>
				<Eye class="mr-2" size={16} />
				View Photo
			</Button>
		{:else}
			<Button variant="ghost" disabled class="cursor-not-allowed">
				<FileX class="mr-2" size={16} />
				No Photo Added
			</Button>
		{/if}
		{#if data?.guarantor?.govtId}
			<Button
				title="View {data?.guarantor?.name}'s ID"
				variant="outline"
				href="/dashboard/files/{data?.guarantor?.govtId}"
				target="_blank"
				rel="noopener noreferrer"
				aria-label="View {data?.guarantor?.name}'s Government Id(FIDA) in a new tab"
			>
				<Eye /> View Guarantor ID
			</Button>
		{:else}
			<Button variant="ghost" disabled class="cursor-not-allowed">
				<FileX class="mr-2" size={16} />
				No Id Added
			</Button>
		{/if}
		{#if data?.guarantor?.document}
			<Button
				title="View {data?.guarantor?.name}'s ID"
				variant="outline"
				href="/dashboard/files/{data?.guarantor?.document}"
				target="_blank"
				rel="noopener noreferrer"
				aria-label="View {data?.guarantor?.name}'s Government Id(FIDA) in a new tab"
			>
				<Eye /> View Guarantor Document
			</Button>
		{:else}
			<Button variant="ghost" disabled class="cursor-not-allowed">
				<FileX class="mr-2" size={16} />
				No Id Added
			</Button>
		{/if}
	</div>
</SingleView>
