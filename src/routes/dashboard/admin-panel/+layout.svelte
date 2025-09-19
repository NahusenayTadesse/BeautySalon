<script>
    import AddRole from '$lib/forms/AddRole.svelte'
    import DialogComp from '$lib/formComponents/DialogComp.svelte';
    let { data, children } = $props();
</script>
{#snippet roles()}
    <AddRole data={data.form} permissions={data.allPermissions} action="/dashboard/admin-panel?/addRole" />
{/snippet}
 
<DialogComp title="Add New Role" content={roles} />

{@render children?.()}