<script lang="ts">
  import { page } from "$app/state";
  import type { Recipe } from "$lib/types/recipe";

  let recipes = $state<Recipe[]>([]);
  let loading = $state(true);
  let error = $state("");

  const ingredientsFromUrl = $derived(
    page.url.searchParams.get("ingredients")?.split(",").filter(Boolean) ?? [],
  );
  const maxTimeFromUrl = $derived(page.url.searchParams.get("maxTime") ?? "");
  const difficultyFromUrl = $derived(
    page.url.searchParams.get("difficulty") ?? "",
  );
  const tagsFromUrl = $derived(
    page.url.searchParams.get("tags")?.split(",").filter(Boolean) ?? [],
  );

  const activeFiltersCount = $derived(
    ingredientsFromUrl.length +
      (maxTimeFromUrl ? 1 : 0) +
      (difficultyFromUrl ? 1 : 0) +
      tagsFromUrl.length,
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

  function recipeMatchesFilters(recipe: Recipe) {
    const matchesIngredients =
      ingredientsFromUrl.length === 0 ||
      ingredientsFromUrl.every((searchIngredient) =>
        recipe.ingredients.some(
          (recipeIngredient) =>
            recipeIngredient.toLowerCase() === searchIngredient.toLowerCase(),
        ),
      );

    const matchesTime =
      !maxTimeFromUrl || recipe.time <= Number(maxTimeFromUrl);
    const matchesDifficulty =
      !difficultyFromUrl || recipe.difficulty === difficultyFromUrl;
    const matchesTags =
      tagsFromUrl.length === 0 ||
      tagsFromUrl.every((selectedTag) =>
        recipe.tags.some(
          (recipeTag) =>
            recipeTag.toLowerCase() === selectedTag.toLowerCase(),
        ),
      );

    return matchesIngredients && matchesTime && matchesDifficulty && matchesTags;
  }

  const filteredRecipes = $derived(
    activeFiltersCount === 0
      ? recipes
      : recipes.filter((recipe) => recipeMatchesFilters(recipe)),
  );
</script>

<main class="page">
  <a class="back-button" href="/">Zurück zur Suche</a>

  <section class="header">
    <p class="eyebrow">Rezeptideen</p>
    <h1>Passende Rezepte entdecken</h1>
    <p>Entdecke passende Rezeptideen und finde schnell etwas Leckeres.</p>
  </section>

  {#if activeFiltersCount > 0}
    <section class="active-search">
      <strong>{filteredRecipes.length} Rezepte gefunden mit:</strong>

      <div>
        {#each ingredientsFromUrl as ingredient}
          <span>{ingredient}</span>
        {/each}
        {#if maxTimeFromUrl}
          <span>bis {maxTimeFromUrl} Min</span>
        {/if}
        {#if difficultyFromUrl}
          <span>{difficultyFromUrl}</span>
        {/if}
        {#each tagsFromUrl as tag}
          <span>{tag}</span>
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
          <div>
            <h2>{recipe.title}</h2>
            <p class="meta">{recipe.time} Min / {recipe.difficulty}</p>
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
