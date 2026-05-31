<script lang="ts">
  import { goto } from "$app/navigation";
  import type { Recipe } from "$lib/types/recipe";

  let ingredient = $state("");
  let ingredients = $state<string[]>([]);
  let recipes = $state<Recipe[]>([]);
  let maxTime = $state("");
  let difficultyFilter = $state("");
  let selectedTags = $state<string[]>([]);
  let tagSearch = $state("");

  const tagOptions = [
    "Schnell",
    "Vegetarisch",
    "Vegan",
    "International",
    "Frühstück",
    "Meal Prep",
  ];

  const activeFiltersCount = $derived(
    ingredients.length +
      (maxTime ? 1 : 0) +
      (difficultyFilter ? 1 : 0) +
      selectedTags.length,
  );

  const matchingRecipesCount = $derived(
    activeFiltersCount === 0
      ? 0
      : recipes.filter((recipe) => recipeMatchesFilters(recipe)).length,
  );
  const customSelectedTags = $derived(
    selectedTags.filter(
      (selectedTag) =>
        !tagOptions.some(
          (tagOption) =>
            tagOption.toLowerCase() === selectedTag.toLowerCase(),
        ),
    ),
  );

  async function loadRecipes() {
    const response = await fetch("/api/recipes");
    recipes = await response.json();
  }

  $effect(() => {
    loadRecipes();
  });

  function addIngredient() {
    const cleaned = ingredient.trim().toLowerCase();

    if (cleaned && !ingredients.includes(cleaned)) {
      ingredients = [...ingredients, cleaned];
      ingredient = "";
    }
  }

  function removeIngredient(item: string) {
    ingredients = ingredients.filter((i) => i !== item);
  }

  function addTag() {
    const cleaned = tagSearch.trim();

    if (
      cleaned &&
      !selectedTags.some((tag) => tag.toLowerCase() === cleaned.toLowerCase())
    ) {
      selectedTags = [...selectedTags, cleaned];
      tagSearch = "";
    }
  }

  function recipeMatchesFilters(recipe: Recipe) {
    const matchesIngredients =
      ingredients.length === 0 ||
      ingredients.every((searchIngredient) =>
        recipe.ingredients.some(
          (recipeIngredient) =>
            recipeIngredient.toLowerCase() === searchIngredient.toLowerCase(),
        ),
      );

    const matchesTime = !maxTime || recipe.time <= Number(maxTime);
    const matchesDifficulty =
      !difficultyFilter || recipe.difficulty === difficultyFilter;
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((selectedTag) =>
        recipe.tags.some(
          (recipeTag) =>
            recipeTag.toLowerCase() === selectedTag.toLowerCase(),
        ),
      );

    return matchesIngredients && matchesTime && matchesDifficulty && matchesTags;
  }

  function searchRecipes() {
    const params = new URLSearchParams();
    const cleanedIngredient = ingredient.trim().toLowerCase();
    const searchIngredients =
      cleanedIngredient && !ingredients.includes(cleanedIngredient)
        ? [...ingredients, cleanedIngredient]
        : ingredients;

    if (searchIngredients.length > 0) {
      params.set("ingredients", searchIngredients.join(","));
    }

    if (maxTime) {
      params.set("maxTime", maxTime);
    }

    if (difficultyFilter) {
      params.set("difficulty", difficultyFilter);
    }

    if (selectedTags.length > 0) {
      params.set("tags", selectedTags.join(","));
    }

    goto(`/recipes?${params.toString()}`);
  }
</script>

<main class="page home-page">
  <section class="hero">
    <div class="hero-content">
      <p class="eyebrow">Rezeptsuche</p>
      <h1>Was kannst du heute kochen?</h1>
      <p class="subtitle">
        Füge deine vorhandenen Zutaten hinzu und finde passende Rezeptideen für
        deinen Vorrat.
      </p>

      <div class="search-card">
        <label for="ingredient">Zutat hinzufügen</label>

        <div class="input-row">
          <input
            id="ingredient"
            type="text"
            bind:value={ingredient}
            placeholder="z.B. Tomate, Eier, Reis"
            onkeydown={(e) => e.key === "Enter" && addIngredient()}
          />

          <button class="add-button ingredient-add-button" onclick={addIngredient}>
            Hinzufügen
          </button>
        </div>

        {#if ingredients.length > 0}
          <div class="ingredients">
            {#each ingredients as item}
              <span class="tag">
                {item}
                <button
                  onclick={() => removeIngredient(item)}
                  aria-label={`${item} entfernen`}
                >
                  ×
                </button>
              </span>
            {/each}
          </div>
        {/if}

        <div class="filter-panel">
          <div class="filter-grid">
            <label for="max-time">
              Max. Zeit
              <select id="max-time" bind:value={maxTime}>
                <option value="">Alle</option>
                <option value="15">bis 15 Min</option>
                <option value="30">bis 30 Min</option>
                <option value="45">bis 45 Min</option>
                <option value="60">bis 60 Min</option>
              </select>
            </label>

            <label for="difficulty">
              Schwierigkeit
              <select id="difficulty" bind:value={difficultyFilter}>
                <option value="">Alle</option>
                <option value="Einfach">Einfach</option>
                <option value="Mittel">Mittel</option>
                <option value="Schwer">Schwer</option>
              </select>
            </label>
          </div>

          <div class="tag-filter-group">
            <label for="tag-search">Weitere Tags</label>
            <div class="tag-search-row">
              <input
                id="tag-search"
                bind:value={tagSearch}
                placeholder="z.B. Asiatisch, Low Carb, Familienküche"
                onkeydown={(e) => e.key === "Enter" && addTag()}
              />
              <button class="tag-add-button" type="button" onclick={addTag}>
                +
              </button>
            </div>

            <div class="filter-tags" aria-label="Tag-Vorschläge">
              {#each tagOptions as tag}
                <label class="filter-chip">
                  <input type="checkbox" bind:group={selectedTags} value={tag} />
                  <span>{tag}</span>
                </label>
              {/each}
              {#each customSelectedTags as tag}
                <label class="filter-chip">
                  <input type="checkbox" bind:group={selectedTags} value={tag} />
                  <span>{tag}</span>
                </label>
              {/each}
            </div>
          </div>
        </div>

        {#if activeFiltersCount > 0}
          <button class="primary-button" onclick={searchRecipes}>
            Passende Rezepte finden
          </button>
        {/if}
      </div>
    </div>

    <div class="visual-card">
      <img
        class="hero-image hero-image-main"
        src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80"
        alt="Bunte Bowl mit Gemüse"
      />
      <img
        class="hero-image hero-image-small"
        src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80"
        alt="Frischer Salat mit Gemüse"
      />

      <div class="mini-stats">
        <div>
          <strong>{ingredients.length}</strong>
          <span>Zutaten</span>
        </div>
        <div>
          <strong>{matchingRecipesCount}</strong>
          <span>Rezepte</span>
        </div>
      </div>
    </div>
  </section>
</main>

<style>
  .home-page {
    padding: 3.5rem 1.5rem 4.5rem;
    background: #faf8f4;
    color: #1f1d1a;
    font-family:
      "Elms Sans",
      ui-sans-serif,
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;
  }

  .hero {
    max-width: 1180px;
    min-height: calc(100vh - 7rem);
    margin: 0 auto;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(320px, 0.82fr);
    gap: 4.5rem;
    align-items: center;
  }

  h1 {
    max-width: 680px;
    margin: 0;
    font-family:
      "Amatic SC",
      cursive;
    font-size: clamp(4rem, 8vw, 7.5rem);
    line-height: 0.88;
    letter-spacing: 0;
    color: #1f1d1a;
    font-weight: 700;
  }

  .hero-content .eyebrow {
    width: fit-content;
    margin-bottom: 1rem;
    padding: 0;
    border-radius: 0;
    background: transparent;
    color: #8a624b;
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .subtitle {
    max-width: 560px;
    margin: 1.25rem 0 2rem;
    color: #68625a;
    font-size: 1.05rem;
    line-height: 1.65;
  }

  .search-card,
  .visual-card {
    border: 1px solid #ece5da;
    background: rgba(255, 255, 255, 0.64);
    box-shadow: none;
  }

  .search-card {
    max-width: 650px;
    padding: 1.1rem 0;
    border-width: 1px 0 0;
    border-radius: 0;
    background: transparent;
  }

  .search-card label {
    display: block;
    margin-bottom: 0.6rem;
    color: #312f2c;
    font-size: 0.95rem;
    font-weight: 700;
  }

  .search-card input,
  .search-card select {
    min-height: 3.1rem;
    border: 0;
    border-bottom: 1px solid #cfc7bb;
    border-radius: 0;
    background-color: transparent;
    color: #1f1d1a;
    font-weight: 500;
    padding: 0.85rem 0;
  }

  .search-card input:focus,
  .search-card select:focus {
    border-color: #1f1d1a;
    box-shadow: none;
  }

  .filter-panel {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #ece5da;
  }

  .filter-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.85rem;
  }

  .tag-filter-group {
    margin-top: 0.95rem;
  }

  .tag-search-row {
    display: flex;
    gap: 0.65rem;
  }

  .tag-search-row input {
    flex: 1;
    min-width: 0;
  }

  .tag-add-button {
    width: 3.1rem;
    border-radius: 0;
    background: #1f1d1a;
    color: white;
    font-size: 1.35rem;
  }

  .tag-add-button:hover {
    background: #8a624b;
  }

  .filter-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.55rem;
    margin-top: 0.75rem;
  }

  .filter-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    margin: 0;
    padding: 0.45rem 0;
    border: 0;
    border-radius: 0;
    background: transparent;
    color: #302d28;
    font-size: 0.9rem;
    font-weight: 650;
    cursor: pointer;
  }

  .filter-chip input {
    width: 0.95rem;
    height: 0.95rem;
    min-height: 0;
    padding: 0;
    flex: 0 0 auto;
    accent-color: #1f1d1a;
  }

  .filter-chip span {
    line-height: 1;
  }

  .visual-card {
    display: grid;
    gap: 1.2rem;
    min-height: 0;
    padding: 0;
    border: 0;
    border-radius: 0;
    background: transparent;
  }

  .mini-stats strong {
    font-family:
      "Amatic SC",
      cursive;
  }

  .hero-image {
    display: block;
    width: 100%;
    object-fit: cover;
    background: #ded7cb;
  }

  .hero-image-main {
    height: 440px;
  }

  .hero-image-small {
    position: static;
    width: 62%;
    height: 210px;
    margin-top: -5rem;
    margin-left: auto;
    border: 10px solid #faf8f4;
  }

  .mini-stats {
    position: static;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    width: 82%;
    margin-top: 0.5rem;
    border: 1px solid #ece5da;
    background: rgba(255, 255, 255, 0.78);
  }

  .mini-stats div {
    padding: 1rem 1.2rem;
  }

  .mini-stats div + div {
    border-left: 1px solid #ece5da;
  }

  .mini-stats strong {
    display: block;
    color: #1f1d1a;
    font-size: 1.8rem;
    font-weight: 750;
  }

  .mini-stats span {
    color: #6d655b;
    font-size: 0.85rem;
  }

  .home-page .primary-button {
    border-radius: 0.25rem;
    border-radius: 0;
    background: #1f1d1a;
    font-weight: 750;
  }

  .home-page .primary-button:hover {
    background: #8a624b;
  }

  .home-page .add-button {
    width: auto;
    min-width: 8rem;
    padding: 0 1rem;
    border-radius: 0;
    background: #1f1d1a;
    color: white;
    font-size: 0.95rem;
  }

  .home-page .add-button:hover {
    background: #8a624b;
  }

  .home-page .tag {
    border: 0;
    border-bottom: 1px solid #cfc7bb;
    border-radius: 0;
    background: transparent;
    color: #302d28;
    font-weight: 650;
  }

  @media (max-width: 850px) {
    .hero {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .visual-card {
      min-height: auto;
    }

    .hero-image-main {
      height: 300px;
    }

    .hero-image-small {
      display: none;
    }

    .mini-stats {
      width: 100%;
    }
  }

  @media (max-width: 520px) {
    .filter-grid {
      grid-template-columns: 1fr;
    }

    .tag-search-row {
      flex-direction: column;
    }

    .tag-add-button {
      width: 100%;
    }
  }
</style>
