<script lang="ts">
  import {
    Camera,
    Database,
    LayoutDashboard,
    Folder,
    Search,
    Settings,
    Users,
    HelpCircle,

	ChartArea,

	Hexagon,

	ScrollText



  } from "@lucide/svelte";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import type { ComponentProps } from "svelte";
  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Dashboard",
        url: "#",
        icon: LayoutDashboard,
      },
      {
        title: "Analytics",
        url: "#",
        icon: ChartArea,
      },
      {
        title: "Projects",
        url: "#",
        icon: Folder,
      },
      {
        title: "Team",
        url: "#",
        icon: Users,
      },
    ],
    navClouds: [
      {
        title: "Capture",
        icon: Camera,
        isActive: true,
        url: "#",
        items: [
          {
            title: "Active Proposals",
            url: "#",
          },
          {
            title: "Archived",
            url: "#",
          },
        ],
      },
      
      
    ],  
     navSecondary: [
      {
        title: "Settings",
        url: "#",
        icon: Settings,
      },
      {
        title: "Get Help",
        url: "#",
        icon: HelpCircle,
      },
      {
        title: "Search",
        url: "#",
        icon: Search,
      },
    ],
    documents: [
      {
        name: "Data Library",
        url: "#",
        icon: Database,
      },
      {
        name: "Reports",
        url: "#",
        icon: ScrollText,
      },
      {
        name: "Word Assistant",
        url: "#",
        icon: File,
      },
    ],
  };
  let { ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
</script>
<Sidebar.Root collapsible="offcanvas" {...restProps}>
  <Sidebar.Header>
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <Sidebar.MenuButton class="data-[slot=sidebar-menu-button]:!p-1.5">
          {#snippet child({ props })}
            <a href="##" {...props}>
              <Hexagon class="!size-5" />
              <span class="text-base font-semibold">Acme Inc.</span>
            </a>
          {/snippet}
        </Sidebar.MenuButton>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
  </Sidebar.Header>
  <Sidebar.Content>

  </Sidebar.Content>
  <Sidebar.Footer>
  </Sidebar.Footer>
</Sidebar.Root>