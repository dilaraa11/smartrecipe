<script lang="ts">
  import { page } from "$app/state";
  import type { Recipe } from "$lib/types/recipe";

  let recipe = $state<Recipe | null>(null);
  let loading = $state(true);
  let error = $state("");
  let favoriteError = $state("");

  async function loadRecipe() {
    try {
      loading = true;
      const id = page.params.id;
      const response = await fetch(`/api/recipes/${id}`);

      if (!response.ok) {
        throw new Error("Rezept konnte nicht geladen werden.");
      }

      recipe = await response.json();
    } catch (err) {
      error = "Fehler beim Laden des Rezepts.";
      console.error(err);
    } finally {
      loading = false;
    }
  }

  async function toggleFavorite() {
    if (!recipe || !recipe._id) return;

    favoriteError = "";
    const newFavoriteValue = !recipe.favorite;

    const response = await fetch(`/api/recipes/${recipe._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ favorite: newFavoriteValue }),
    });

    if (response.ok) {
      recipe = { ...recipe, favorite: newFavoriteValue };
    } else if (response.status === 401) {
      favoriteError = "Bitte logge dich ein, um Favoriten zu speichern.";
    } else {
      favoriteError = "Favorit konnte nicht gespeichert werden.";
    }
  }

  $effect(() => {
    loadRecipe();
  });
</script>

<main class="page">
  <a class="back-button" href="/recipes">Zurück zu Rezepten</a>

  {#if loading}
    <section class="status-card">
      <p>Rezept wird geladen...</p>
    </section>
  {:else if error}
    <section class="status-card">
      <p>{error}</p>
    </section>
  {:else if recipe}
    <section class="recipe-detail">
      <div class="hero">
        <div>
          <p class="eyebrow">{recipe.category}</p>
          <h1>{recipe.title}</h1>

          <div class="meta">
            <span>{recipe.time} Minuten</span>
            <span>{recipe.difficulty}</span>
          </div>

          <button class="favorite-button" onclick={toggleFavorite}>
            {recipe.favorite ? "Favorit entfernen" : "Als Favorit speichern"}
          </button>

          {#if favoriteError}
            <p class="favorite-error">{favoriteError}</p>
            <a class="login-link" href="/login">Zum Login</a>
          {/if}
        </div>
      </div>

      <div class="tags">
        {#each recipe.tags as tag}
          <span>{tag}</span>
        {/each}
      </div>

      <section class="card">
        <h2>Zutaten</h2>

        <ul>
          {#each recipe.ingredients as ingredient}
            <li>{ingredient}</li>
          {/each}
        </ul>
      </section>

      <section class="card">
        <h2>Zubereitung</h2>
        <p>{recipe.instructions}</p>
      </section>
    </section>
  {/if}
</main>

<style>
  .recipe-detail .hero {
    display: block;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #ece5da;
  }

  .recipe-detail .eyebrow {
    margin-bottom: 0.6rem;
  }

  .recipe-detail .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.9rem;
    margin-top: 1.2rem;
    color: #68625a;
  }

  .recipe-detail .meta span + span::before {
    content: "/";
    margin-right: 0.9rem;
    color: #cfc7bb;
  }

  ul {
    padding-left: 1.2rem;
  }

  li {
    margin-bottom: 0.5rem;
  }

  p {
    line-height: 1.8;
  }

  .favorite-error {
    margin: 0.8rem 0 0;
    color: #991b1b;
    font-weight: 700;
  }

  .login-link {
    display: inline-block;
    margin-top: 0.5rem;
    color: #1f1d1a;
    font-weight: 750;
  }
</style>
