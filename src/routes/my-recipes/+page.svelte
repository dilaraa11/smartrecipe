<script lang="ts">
  import type { Recipe } from "$lib/types/recipe";

  let recipes = $state<Recipe[]>([]);
  let loading = $state(true);
  let error = $state("");
  let mustLogin = $state(false);

  async function loadMyRecipes() {
    try {
      loading = true;
      error = "";
      mustLogin = false;

      const response = await fetch("/api/my-recipes");

      if (response.status === 401) {
        mustLogin = true;
        recipes = [];
        return;
      }

      if (!response.ok) {
        throw new Error("Eigene Rezepte konnten nicht geladen werden.");
      }

      recipes = await response.json();
    } catch (err) {
      error = "Beim Laden deiner Rezepte ist ein Fehler passiert.";
      console.error(err);
    } finally {
      loading = false;
    }
  }

  $effect(() => {
    loadMyRecipes();
  });
</script>

<main class="page">
  <a class="back-button" href="/recipes">Zurück zu Rezepten</a>

  <section class="header">
    <p class="eyebrow">Eigene Sammlung</p>
    <h1>Meine Rezepte</h1>
    <p>Hier erscheinen nur die Rezepte, die du selbst erstellt hast.</p>
  </section>

  {#if loading}
    <section class="status-card">
      <p>Deine Rezepte werden geladen...</p>
    </section>
  {:else if mustLogin}
    <section class="empty-card">
      <h2>Bitte einloggen</h2>
      <p>Deine eigenen Rezepte sind nur sichtbar, wenn du angemeldet bist.</p>
      <a href="/login">Zum Login</a>
    </section>
  {:else if error}
    <section class="status-card">
      <p>{error}</p>
    </section>
  {:else if recipes.length === 0}
    <section class="empty-card">
      <h2>Noch keine eigenen Rezepte</h2>
      <p>Erstelle dein erstes Rezept und finde es danach hier wieder.</p>
      <a href="/create">Rezept erstellen</a>
    </section>
  {:else}
    <section class="recipe-grid">
      {#each recipes as recipe}
        <article class="recipe-card">
          {#if recipe.imageUrl}
            <img class="recipe-card-image" src={recipe.imageUrl} alt={recipe.title} />
          {/if}

          <h2>{recipe.title}</h2>
          <p class="meta">{recipe.time} Min / {recipe.difficulty}</p>

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
