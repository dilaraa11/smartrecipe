<script lang="ts">
  import { page } from "$app/state";
  import type { Recipe } from "$lib/types/recipe";

  let recipe = $state<Recipe | null>(null);
  let loading = $state(true);
  let error = $state("");
  let favoriteError = $state("");
  let servings = $state<2 | 4>(2);

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
      {#if recipe.imageUrl}
        <img class="recipe-hero-image" src={recipe.imageUrl} alt={recipe.title} />
      {/if}

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
        <div class="section-heading">
          <h2>Zutaten</h2>
          {#if recipe.ingredientAmounts?.length}
            <div class="serving-switch" aria-label="Portionen auswählen">
              <button
                class:active={servings === 2}
                type="button"
                onclick={() => (servings = 2)}
              >
                2 Personen
              </button>
              <button
                class:active={servings === 4}
                type="button"
                onclick={() => (servings = 4)}
              >
                4 Personen
              </button>
            </div>
          {/if}
        </div>

        {#if recipe.ingredientAmounts?.length}
          <ul class="ingredient-list">
            {#each recipe.ingredientAmounts as ingredient}
              <li>
                <span>{ingredient.name}</span>
                <strong>
                  {servings === 2 ? ingredient.amount2 : ingredient.amount4}
                </strong>
              </li>
            {/each}
          </ul>
        {:else}
          <ul>
            {#each recipe.ingredients as ingredient}
              <li>{ingredient}</li>
            {/each}
          </ul>
        {/if}
      </section>

      <section class="card">
        <h2>Zubereitung</h2>
        <p>{recipe.instructions}</p>
      </section>

      {#if recipe.createdByUsername}
        <p class="created-by">
          Erstellt von {recipe.createdByCurrentUser
            ? "dir"
            : recipe.createdByUsername}
        </p>
      {/if}
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

  .recipe-hero-image {
    display: block;
    width: 100%;
    max-height: 520px;
    margin-bottom: 2rem;
    object-fit: cover;
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

  .section-heading {
    display: flex;
    gap: 1rem;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .section-heading h2 {
    margin: 0;
  }

  .serving-switch {
    display: flex;
    border: 1px solid #ece5da;
  }

  .serving-switch button {
    padding: 0.6rem 0.8rem;
    background: transparent;
    color: #68625a;
    font-weight: 650;
  }

  .serving-switch button + button {
    border-left: 1px solid #ece5da;
  }

  .serving-switch button.active,
  .serving-switch button:hover {
    background: #1f1d1a;
    color: white;
  }

  .ingredient-list {
    padding: 0;
    list-style: none;
  }

  .ingredient-list li {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.65rem 0;
    border-bottom: 1px solid #ece5da;
  }

  .ingredient-list strong {
    color: #1f1d1a;
    white-space: nowrap;
  }

  .created-by {
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid #ece5da;
    color: #68625a;
    font-weight: 650;
  }
</style>
