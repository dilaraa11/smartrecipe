<script lang="ts">
  import { page } from "$app/state";
  import type { Recipe } from "$lib/types/recipe";

  let recipes = $state<Recipe[]>([]);
  let loading = $state(true);
  let error = $state("");

  const ingredientsFromUrl = $derived(
    page.url.searchParams.get("ingredients")?.split(",").filter(Boolean) ?? [],
  );

  async function loadRecipes() {
    try {
      loading = true;
      error = "";

      const response = await fetch("/api/recipes");

      if (!response.ok) {
        throw new Error("Rezepte konnten nicht geladen werden.");
      }

      recipes = await response.json();
    } catch (err) {
      error = "Beim Laden der Rezepte ist ein Fehler passiert.";
      console.error(err);
    } finally {
      loading = false;
    }
  }

  $effect(() => {
    loadRecipes();
  });

  const filteredRecipes = $derived(
    ingredientsFromUrl.length === 0
      ? recipes
      : recipes.filter((recipe) =>
          ingredientsFromUrl.every((searchIngredient) =>
            recipe.ingredients.some(
              (recipeIngredient) =>
                recipeIngredient.toLowerCase() ===
                searchIngredient.toLowerCase(),
            ),
          ),
        ),
  );
</script>

<main class="page">
  <a class="back-button" href="/"> ← Zurück zur Suche </a>
  <section class="header">
    <p class="eyebrow">Rezeptideen</p>
    <h1>Passende Rezepte entdecken</h1>
    <p>Diese Rezepte werden direkt aus deiner MongoDB-Datenbank geladen.</p>
  </section>

  {#if ingredientsFromUrl.length > 0}
    <section class="active-search">
      <strong>Gesucht mit:</strong>

      <div>
        {#each ingredientsFromUrl as ingredient}
          <span>{ingredient}</span>
        {/each}
      </div>
    </section>
  {/if}

  {#if loading}
    <section class="status-card">
      <p>Rezepte werden geladen...</p>
    </section>
  {:else if error}
    <section class="status-card">
      <p>{error}</p>
    </section>
  {:else if filteredRecipes.length === 0}
    <section class="status-card">
      <p>Keine passenden Rezepte gefunden.</p>
    </section>
  {:else}
    <section class="recipe-grid">
      {#each filteredRecipes as recipe}
        <article class="recipe-card">
          <div class="emoji">{recipe.emoji}</div>

          <div>
            <h2>{recipe.title}</h2>
            <p class="meta">{recipe.time} Min · {recipe.difficulty}</p>
          </div>

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

