<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";

  import type { SuperValidated, Infer } from 'sveltekit-superforms';
  import { superForm } from 'sveltekit-superforms'
  import type { LoginSchema } from '$lib/ZodSchema';
  	import DarkMode from '$lib/components/DarkMode.svelte';
    import { Eye, EyeOff} from "@lucide/svelte"


  let { data, action="?/login" } : { data : SuperValidated<Infer<LoginSchema>>, action:string } = $props();

  const { form, errors, enhance } = superForm(data);

  let eye = $state(false);
  let EyeIcon = $derived(eye ? EyeOff: Eye)
</script>
<Card.Root class="mx-auto w-full max-w-md justify-self-center flex flex-col justify-center ">
   
    
  <Card.Header>
     <div class="w-full flex flex-col justify-center items-center">
        <img src="/logo.png" class="w-24 h-24" alt="Placeholder Logo">
    </div>
    <Card.Title class="text-2xl flex flex-row justify-between">Login  <DarkMode /></Card.Title>
    <Card.Description>Enter your email below to login to your account</Card.Description>
  </Card.Header>
  <Card.Content>
    <form method="POST" {action} use:enhance>

    <div class="grid gap-4">
      <div class="grid gap-2">
        <Label for="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="m@example.com" bind:value={$form.email} required />
            {#if $errors.email}<span class="text-red-500">{$errors.email}</span>{/if}
      </div>
      <div class="grid gap-2">
        <div class="flex items-center">
          <Label for="password">Password</Label>
          <a href="/forgot-password" class="ml-auto inline-block text-sm underline">
            Forgot your password?
          </a>
        </div>
        <div class="relative">
        <Input id="password" name="password" type={eye ? "text": "password"}  bind:value={$form.password} required />
        <button type="button" onclick={()=>eye = !eye} title="Make Password Visible">
        <EyeIcon class="h-6 w-6 absolute top-0.5 right-2 transition-transform ease-in-out duration-300" />
        </button>
         {#if $errors.password}<span class="text-red-500">{$errors.password}</span>{/if}
         </div>

      </div>
      <Button type="submit" class="w-full">Login</Button>
    </div>
    </form>
   
  </Card.Content>
</Card.Root>