<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";

  import type { SuperValidated, Infer } from 'sveltekit-superforms';
  import { superForm } from 'sveltekit-superforms'
  import type { LoginSchema } from '$lib/ZodSchema';

  let { data, action="?/login" } : { data : SuperValidated<Infer<LoginSchema>>, action:string } = $props();

  const { form, errors, enhance } = superForm(data);
</script>
<Card.Root class="mx-auto w-full max-w-sm">
  <Card.Header>
    <Card.Title class="text-2xl">Login</Card.Title>
    <Card.Description>Enter your email below to login to your account</Card.Description>
  </Card.Header>
  <Card.Content>
    <form method="POST" {action} use:enhance>

    <div class="grid gap-4">
      <div class="grid gap-2">
        <Label for="email">Email</Label>
        <Input id="email" type="email" placeholder="m@example.com" bind:value={$form.email} required />
            {#if $errors.email}<span class="text-red-500">{$errors.email}</span>{/if}

        
      </div>
      <div class="grid gap-2">
        <div class="flex items-center">
          <Label for="password">Password</Label>
          <a href="/forgot-password" class="ml-auto inline-block text-sm underline">
            Forgot your password?
          </a>
        </div>
        <Input id="password" type="password" bind:value={$form.password} required />
         {#if $errors.password}<span class="text-red-500">{$errors.password}</span>{/if}

      </div>
      <Button type="submit" class="w-full">Login</Button>
    </div>
    </form>
   
  </Card.Content>
</Card.Root>