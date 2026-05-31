<script lang="ts">
  import "../app.css";
  import favicon from "$lib/assets/favicon.svg";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/recipes", label: "Rezepte" },
    { href: "/create", label: "Erstellen" },
    { href: "/favorites", label: "Favoriten" },
  ];

  let currentUser = $state<{ name: string; email: string } | null>(null);

  async function loadCurrentUser() {
    const response = await fetch("/api/auth/me");
    const result = await response.json();

    currentUser = result.user ?? null;
  }

  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    currentUser = null;
    goto("/login");
  }

  $effect(() => {
    $page.url.pathname;
    loadCurrentUser();
  });

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

    {#if currentUser}
      <div class="profile-chip" title={currentUser.email}>
        <span>{currentUser.name.slice(0, 1).toUpperCase()}</span>
        <strong>{currentUser.name}</strong>
      </div>
      <button class="logout-button" type="button" onclick={logout}>
        Logout
      </button>
    {:else}
      <a href="/login" class:active={$page.url.pathname === "/login"}>
        Login
      </a>
    {/if}
  </div>
</nav>

<!-- HIER wird deine Seite gerendert -->
{@render children()}
