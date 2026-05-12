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

  const matchingRecipesCount = $derived(
    ingredients.length === 0
      ? 0
      : recipes.filter((recipe) =>
          ingredients.every((searchIngredient) =>
            recipe.ingredients.some(
              (recipeIngredient) =>
                recipeIngredient.toLowerCase() ===
                searchIngredient.toLowerCase(),
            ),
          ),
        ).length,
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

  function searchRecipes() {
    const query = ingredients.join(",");
    goto(`/recipes?ingredients=${query}`);
  }
</script>

<main class="page">
  <section class="hero">
    <div class="hero-content">
      <p class="eyebrow">Dein persönlicher Küchen-Assistent</p>
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

          <button class="add-button" onclick={addIngredient}>+</button>
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
        {:else}
          <div class="empty-state">
            <span>🥕</span>
            <p>
              Füge deine ersten Zutaten hinzu, um Rezeptvorschläge zu erhalten.
            </p>
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
              />
              <button class="tag-add-button" type="button">+</button>
            </div>

            <div class="filter-tags" aria-label="Tag-Vorschläge">
              {#each tagOptions as tag}
                <label class="filter-chip">
                  <input type="checkbox" bind:group={selectedTags} value={tag} />
                  <span>{tag}</span>
                </label>
              {/each}
            </div>
          </div>
        </div>

        {#if ingredients.length > 0}
          <button class="primary-button" onclick={searchRecipes}>
            Passende Rezepte finden
          </button>
        {/if}
      </div>
    </div>

    <div class="visual-card">
      <div class="plate">🍳</div>
      <h2>SmartRecipe</h2>
      <p>Aus deinem Vorrat werden passende Mahlzeiten.</p>

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
  .hero {
    max-width: 1120px;
    min-height: calc(100vh - 6rem);
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 3rem;
    align-items: center;
  }

  h1 {
    max-width: 720px;
    margin: 0;
    font-size: clamp(2.8rem, 6vw, 5.8rem);
    line-height: 0.95;
    letter-spacing: -0.06em;
    color: #2f2418;
  }

  .subtitle {
    max-width: 580px;
    margin: 1.4rem 0 2rem;
    font-size: 1.15rem;
    line-height: 1.7;
    color: #6b5b4a;
  }

  .search-card,
  .visual-card {
    border: 1px solid rgba(255, 255, 255, 0.8);
    background: rgba(255, 255, 255, 0.72);
    backdrop-filter: blur(18px);
    box-shadow: 0 24px 70px rgba(120, 53, 15, 0.14);
  }

  .search-card {
    max-width: 620px;
    padding: 1.4rem;
    border-radius: 1.8rem;
  }

  .search-card label {
    display: block;
    margin-bottom: 0.6rem;
  }

  .filter-panel {
    margin-top: 1.2rem;
    padding-top: 1.2rem;
    border-top: 1px solid rgba(253, 186, 116, 0.65);
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
    border-radius: 1rem;
    background: #fb923c;
    color: white;
    font-size: 1.35rem;
  }

  .tag-add-button:hover {
    background: #ea580c;
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
    padding: 0.5rem 0.7rem;
    border-radius: 999px;
    background: rgba(255, 237, 213, 0.72);
    color: #7c2d12;
    font-size: 0.9rem;
    font-weight: 800;
    cursor: pointer;
  }

  .filter-chip input {
    width: 0.95rem;
    height: 0.95rem;
    min-height: 0;
    padding: 0;
    flex: 0 0 auto;
    accent-color: #fb923c;
  }

  .filter-chip span {
    line-height: 1;
  }

  .empty-state {
    margin-top: 1.2rem;
    padding: 1.2rem;
    border: 1px dashed #fdba74;
    border-radius: 1.2rem;
    background: rgba(255, 247, 237, 0.65);
    text-align: center;
    color: #7c5d3f;
  }

  .empty-state span {
    font-size: 2rem;
  }

  .empty-state p {
    margin: 0.5rem 0 0;
  }

  .visual-card {
    position: relative;
    padding: 2rem;
    border-radius: 2.2rem;
    text-align: center;
    overflow: hidden;
  }

  .visual-card::before {
    content: "";
    position: absolute;
    inset: -30%;
    background: radial-gradient(
      circle,
      rgba(251, 146, 60, 0.24),
      transparent 55%
    );
    z-index: -1;
  }

  .plate {
    width: 12rem;
    height: 12rem;
    margin: 0 auto 1.5rem;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: #fffaf3;
    box-shadow:
      inset 0 0 0 1.1rem #fef3c7,
      0 22px 50px rgba(120, 53, 15, 0.12);
    font-size: 5rem;
  }

  .visual-card h2 {
    margin: 0 0 0.5rem;
    font-size: 2rem;
    color: #2f2418;
  }

  .visual-card p {
    margin: 0;
    color: #6b5b4a;
  }

  .mini-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-top: 1.8rem;
  }

  .mini-stats div {
    padding: 1rem;
    border-radius: 1.2rem;
    background: rgba(255, 250, 243, 0.8);
  }

  .mini-stats strong {
    display: block;
    font-size: 1.7rem;
    color: #ea580c;
  }

  .mini-stats span {
    color: #6b5b4a;
    font-size: 0.9rem;
  }

  @media (max-width: 850px) {
    .hero {
      grid-template-columns: 1fr;
    }

    .visual-card {
      display: none;
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
