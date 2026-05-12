<script lang="ts">
  import "../app.css";
  import favicon from "$lib/assets/favicon.svg";
  import { page } from "$app/stores";

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/recipes", label: "Rezepte" },
    { href: "/create", label: "Erstellen" },
    { href: "/favorites", label: "Favoriten" },
  ];

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<nav class="navbar">
  <a href="/" class="brand">🍳 SmartRecipe</a>

  <div class="nav-links">
    {#each navItems as item}
      <a href={item.href} class:active={$page.url.pathname === item.href}>
        {item.label}
      </a>
    {/each}
  </div>
</nav>

<!-- HIER wird deine Seite gerendert -->
{@render children()}
