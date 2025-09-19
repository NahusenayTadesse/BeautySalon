Services
<script>
    import Button from "$lib/components/ui/button/button.svelte";
	import { UserPlus } from "@lucide/svelte";
    import AddRole from '$lib/forms/AddRole.svelte'
    import DialogComp from '$lib/formComponents/DialogComp.svelte';
	import { enhance } from "$app/forms";
    let { data } = $props();
</script>
{#snippet roles()}
    <AddRole data={data.form} permissions={data.allPermissions}  action="?/addRole" /> 
{/snippet}

<DialogComp title="Add New Role" content={roles} />
<div>
<Button href="/dashboard/admin-panel/add-users"><UserPlus />Add Users</Button>
</div>

<form action="?/addRole" method="post" use:enhance>

    <input type="text" >
    <input type=submit />
</form>


