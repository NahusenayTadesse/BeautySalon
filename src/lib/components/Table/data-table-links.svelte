<script lang="ts">
 
 let { id, name, link }: { id: string, name: string, link: string } = $props();
</script>

<a href="{link}/{id}" class="hover:scale-110 capitalize transition-all duration-600 ease-in-out flex flex-row !justify-start"> 
 {name}
</a>


 