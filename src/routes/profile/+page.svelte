<script lang="ts">
  let user = $state<{ name: string; email: string } | null>(null);
  let loading = $state(true);

  async function loadProfile() {
    try {
      const response = await fetch("/api/auth/me");
      const result = await response.json();

      user = result.user ?? null;
    } finally {
      loading = false;
    }
  }

  $effect(() => {
    loadProfile();
  });
</script>

<main class="page">
  <a class="back-button" href="/">Zurück zur Startseite</a>

  {#if loading}
    <section class="status-card">
      <p>Profil wird geladen...</p>
    </section>
  {:else if !user}
    <section class="empty-card">
      <h2>Bitte einloggen</h2>
      <p>Du brauchst ein Konto, um dein Profil anzusehen.</p>
      <a href="/login">Zum Login</a>
    </section>
  {:else}
    <section class="header">
      <p class="eyebrow">Profil</p>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </section>
  {/if}
</main>
