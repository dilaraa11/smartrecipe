<script lang="ts">
  import type { Recipe } from "$lib/types/recipe";

  let recipes = $state<Recipe[]>([]);
  let loading = $state(true);
  let error = $state("");
  let mustLogin = $state(false);
  let deletingRecipeId = $state<string | null>(null);

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

  async function deleteRecipe(recipe: Recipe) {
    if (!recipe._id) return;

    const confirmed = confirm(
      `Möchtest du "${recipe.title}" wirklich löschen?`,
    );

    if (!confirmed) return;

    try {
      deletingRecipeId = recipe._id;
      error = "";

      const response = await fetch(`/api/recipes/${recipe._id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Rezept konnte nicht gelöscht werden.");
      }

      recipes = recipes.filter((item) => item._id !== recipe._id);
    } catch (err) {
      error =
        err instanceof Error
          ? err.message
          : "Beim Löschen des Rezepts ist ein Fehler passiert.";
    } finally {
      deletingRecipeId = null;
    }
  }
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

          <div class="recipe-actions">
            <a class="recipe-button" href={`/recipes/${recipe._id}`}>
              Rezept ansehen
            </a>
            <a class="edit-recipe-button" href={`/my-recipes/${recipe._id}/edit`}>
              Bearbeiten
            </a>
          </div>

          <button
            class="delete-recipe-button"
            type="button"
            disabled={deletingRecipeId === recipe._id}
            onclick={() => deleteRecipe(recipe)}
          >
            {deletingRecipeId === recipe._id ? "Wird gelöscht..." : "Löschen"}
          </button>
        </article>
      {/each}
    </section>
  {/if}
</main>

<style>
  .delete-recipe-button {
    width: 100%;
    margin-top: 0.65rem;
    padding: 0.85rem 1rem;
    border: 1px solid #cfc7bb;
    background: transparent;
    color: #991b1b;
    font-weight: 900;
  }

  .delete-recipe-button:hover {
    border-color: #991b1b;
    background: #fff7f7;
  }

  .delete-recipe-button:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }

  .recipe-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.65rem;
  }

  .edit-recipe-button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.85rem 1rem;
    border: 1px solid #1f1d1a;
    color: #1f1d1a;
    font-weight: 900;
    text-align: center;
  }

  .edit-recipe-button:hover {
    background: #f4eee6;
  }

  @media (max-width: 560px) {
    .recipe-actions {
      grid-template-columns: 1fr;
    }
  }
</style>
