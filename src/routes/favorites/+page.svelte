<script lang="ts">
  import type { Recipe } from "$lib/types/recipe";

  let favorites = $state<Recipe[]>([]);
  let loading = $state(true);
  let error = $state("");
  let mustLogin = $state(false);

  async function loadFavorites() {
    try {
      loading = true;
      error = "";
      mustLogin = false;

      const response = await fetch("/api/favorites");

      if (response.status === 401) {
        mustLogin = true;
        favorites = [];
        return;
      }

      if (!response.ok) {
        throw new Error("Favoriten konnten nicht geladen werden.");
      }

      favorites = await response.json();
    } catch (err) {
      error = "Beim Laden der Favoriten ist ein Fehler passiert.";
      console.error(err);
    } finally {
      loading = false;
    }
  }

  $effect(() => {
    loadFavorites();
  });
</script>

<main class="page">
  <a class="back-button" href="/recipes"> ← Zurück zu Rezepten </a>
  <section class="header">
    <p class="eyebrow">Gespeicherte Rezepte</p>
    <h1>Meine Favoriten</h1>
    <p>Hier erscheinen alle Rezepte, die du als Favorit gespeichert hast.</p>
  </section>

  {#if loading}
    <section class="status-card">
      <p>Favoriten werden geladen...</p>
    </section>
  {:else if mustLogin}
    <section class="empty-card">
      <div class="icon">🔒</div>
      <h2>Bitte einloggen</h2>
      <p>Favoriten sind nur verfügbar, wenn du angemeldet bist.</p>
      <a href="/login">Zum Login</a>
    </section>
  {:else if error}
    <section class="status-card">
      <p>{error}</p>
    </section>
  {:else if favorites.length === 0}
    <section class="empty-card">
      <div class="icon">❤️</div>
      <h2>Noch keine Favoriten</h2>
      <p>Speichere Rezepte, die du gerne wieder kochen möchtest.</p>
      <a href="/recipes">Rezepte entdecken</a>
    </section>
  {:else}
    <section class="recipe-grid">
      {#each favorites as recipe}
        <article class="recipe-card">
          <div class="emoji">{recipe.emoji}</div>

          <h2>{recipe.title}</h2>
          <p class="meta">{recipe.time} Min · {recipe.difficulty}</p>

          <div class="tags">
            {#each recipe.tags as tag}
              <span>{tag}</span>
            {/each}
          </div>

          <p class="ingredients-text">
            Zutaten: {recipe.ingredients.join(", ")}
          </p>

          <a class="recipe-button" href={`/recipes/${recipe._id}`}>
            Rezept ansehen
          </a>
        </article>
      {/each}
    </section>
  {/if}
</main>

