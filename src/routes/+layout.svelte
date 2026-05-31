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
  let profileOpen = $state(false);

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
    profileOpen = false;
    goto("/login");
  }

  $effect(() => {
    $page.url.pathname;
    profileOpen = false;
    loadCurrentUser();
  });

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&family=Elms+Sans:wght@400;500;600;700;800&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<nav class="navbar">
  <a href="/" class="brand">SmartRecipe</a>

  <div class="nav-links">
    {#each navItems as item}
      <a href={item.href} class:active={$page.url.pathname === item.href}>
        {item.label}
      </a>
    {/each}

    {#if currentUser}
      <div class="profile-menu">
        <button
          class="profile-chip"
          type="button"
          title={currentUser.email}
          aria-haspopup="menu"
          aria-expanded={profileOpen}
          onclick={() => (profileOpen = !profileOpen)}
        >
          <span>{currentUser.name.slice(0, 1).toUpperCase()}</span>
          <strong>{currentUser.name}</strong>
        </button>

        {#if profileOpen}
          <div class="profile-dropdown" role="menu">
            <a class="profile-summary" href="/profile" role="menuitem">
              <span>{currentUser.name.slice(0, 1).toUpperCase()}</span>
              <div>
                <strong>{currentUser.name}</strong>
                <small>{currentUser.email}</small>
              </div>
            </a>

            <button type="button" onclick={logout} role="menuitem">
              Logout
            </button>
          </div>
        {/if}
      </div>
    {:else}
      <a href="/login" class:active={$page.url.pathname === "/login"}>
        Login
      </a>
    {/if}
  </div>
</nav>

{@render children()}
