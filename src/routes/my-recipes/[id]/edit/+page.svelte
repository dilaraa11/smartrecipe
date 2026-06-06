<script lang="ts">
  import { page } from "$app/state";
  import type { Recipe } from "$lib/types/recipe";

  let recipe = $state<Recipe | null>(null);
  let title = $state("");
  let time = $state("");
  let difficulty = $state<"Einfach" | "Mittel" | "Schwer">("Einfach");
  let tag = $state("");
  let tags = $state<string[]>([]);
  let baseServings = $state<2 | 4>(2);
  let ingredient = $state("");
  let ingredientAmount = $state("");
  let ingredients = $state<{ name: string; amount: string }[]>([]);
  let imageUrl = $state("");
  let instructions = $state("");
  let loading = $state(true);
  let saving = $state(false);
  let formSubmitted = $state(false);
  let successMessage = $state("");
  let errorMessage = $state("");

  async function loadRecipe() {
    try {
      loading = true;
      errorMessage = "";

      const response = await fetch(`/api/recipes/${page.params.id}`);

      if (!response.ok) {
        throw new Error("Rezept konnte nicht geladen werden.");
      }

      recipe = await response.json();

      if (!recipe.createdByCurrentUser) {
        errorMessage = "Du kannst nur eigene Rezepte bearbeiten.";
        return;
      }

      title = recipe.title;
      time = String(recipe.time || "");
      difficulty = recipe.difficulty;
      tags = recipe.tags ?? [];
      baseServings = recipe.baseServings ?? 2;
      ingredients =
        recipe.ingredientDetails?.length
          ? recipe.ingredientDetails
          : recipe.ingredients.map((name) => ({ name, amount: "" }));
      imageUrl = recipe.imageUrl ?? "";
      instructions = recipe.instructions;
    } catch (err) {
      errorMessage = "Beim Laden des Rezepts ist ein Fehler passiert.";
      console.error(err);
    } finally {
      loading = false;
    }
  }

  $effect(() => {
    loadRecipe();
  });

  function addIngredient() {
    const cleanedName = ingredient.trim();
    const cleanedAmount = ingredientAmount.trim();

    if (!cleanedName || !cleanedAmount) {
      errorMessage = "Bitte gib Zutat und Menge ein.";
      return;
    }

    if (
      !ingredients.some(
        (item) => item.name.toLowerCase() === cleanedName.toLowerCase(),
      )
    ) {
      ingredients = [
        ...ingredients,
        {
          name: cleanedName,
          amount: cleanedAmount,
        },
      ];
    }

    ingredient = "";
    ingredientAmount = "";
    errorMessage = "";
  }

  function updateIngredientName(index: number, value: string) {
    ingredients = ingredients.map((item, itemIndex) =>
      itemIndex === index ? { ...item, name: value } : item,
    );
  }

  function updateIngredientAmount(index: number, value: string) {
    ingredients = ingredients.map((item, itemIndex) =>
      itemIndex === index ? { ...item, amount: value } : item,
    );
  }

  function removeIngredient(index: number) {
    ingredients = ingredients.filter((_, itemIndex) => itemIndex !== index);
  }

  function addTag() {
    const cleaned = tag.trim();

    if (
      cleaned &&
      !tags.some((existingTag) => existingTag.toLowerCase() === cleaned.toLowerCase())
    ) {
      tags = [...tags, cleaned];
      tag = "";
    }
  }

  function removeTag(tagToRemove: string) {
    tags = tags.filter((existingTag) => existingTag !== tagToRemove);
  }

  function getMissingRequiredFields() {
    const missingFields = [];

    if (!title.trim()) missingFields.push("Rezeptname");
    if (!time || Number(time) <= 0) missingFields.push("Dauer");
    if (ingredients.length === 0 || ingredients.some((item) => !item.name.trim())) {
      missingFields.push("Zutaten");
    }
    if (
      ingredients.length === 0 ||
      ingredients.some((item) => !item.amount.trim()) ||
      (ingredient.trim() && !ingredientAmount.trim())
    ) {
      missingFields.push("Menge");
    }
    if (!instructions.trim()) missingFields.push("Zubereitung");

    return missingFields;
  }

  function uploadImage(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      errorMessage = "Bitte wähle eine Bilddatei aus.";
      input.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      imageUrl = String(reader.result);
      errorMessage = "";
    };

    reader.readAsDataURL(file);
  }

  async function saveRecipe() {
    formSubmitted = true;
    successMessage = "";
    errorMessage = "";

    const missingFields = getMissingRequiredFields();

    if (missingFields.length > 0) {
      errorMessage = `Bitte fülle folgende Pflichtfelder aus: ${missingFields.join(
        ", ",
      )}.`;
      return;
    }

    try {
      saving = true;

      const response = await fetch(`/api/recipes/${page.params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          time: Number(time),
          difficulty,
          tags,
          category: tags[0] ?? "",
          baseServings,
          ingredients: ingredients.map((item) => ({
            name: item.name.trim(),
            amount: item.amount.trim(),
          })),
          imageUrl,
          instructions: instructions.trim(),
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Rezept konnte nicht gespeichert werden.");
      }

      successMessage = "Rezept wurde erfolgreich aktualisiert.";
    } catch (err) {
      errorMessage =
        err instanceof Error
          ? err.message
          : "Beim Speichern des Rezepts ist ein Fehler passiert.";
    } finally {
      saving = false;
    }
  }
</script>

<main class="page">
  <a class="back-button" href="/my-recipes">Zurück zu Meine Rezepte</a>

  <section class="header">
    <p class="eyebrow">Eigenes Rezept</p>
    <h1>Rezept bearbeiten</h1>
    <p>Passe Name, Mengenangaben, Tags und Zubereitung deines Rezepts an.</p>
  </section>

  {#if loading}
    <section class="status-card">
      <p>Rezept wird geladen...</p>
    </section>
  {:else if errorMessage && !recipe?.createdByCurrentUser}
    <section class="status-card">
      <p>{errorMessage}</p>
    </section>
  {:else}
    <section class="form-card">
      <div class="form-grid">
        <label>
          <span class="required-label">Rezeptname</span>
          <input
            class:field-error={formSubmitted && !title.trim()}
            bind:value={title}
            placeholder="z.B. Tomaten-Omelett"
          />
        </label>

        <div class="image-upload-section">
          <label for="recipe-image">Bild des Gerichts</label>
          <input
            id="recipe-image"
            type="file"
            accept="image/*"
            onchange={uploadImage}
          />

          {#if imageUrl}
            <img class="image-preview" src={imageUrl} alt="Vorschau des Gerichts" />
          {:else}
            <p class="hint">Noch kein Bild ausgewählt.</p>
          {/if}
        </div>

        <label>
          <span class="required-label">Dauer in Minuten</span>
          <input
            class:field-error={formSubmitted && (!time || Number(time) <= 0)}
            bind:value={time}
            type="number"
            min="1"
            placeholder="z.B. 20"
          />
        </label>

        <label class="dropdown-label">
          Schwierigkeit
          <select bind:value={difficulty}>
            <option>Einfach</option>
            <option>Mittel</option>
            <option>Schwer</option>
          </select>
        </label>

        <div class="tag-section">
          <label for="recipe-tag">Tag</label>
          <div class="tag-input-row">
            <input
              id="recipe-tag"
              bind:value={tag}
              placeholder="z.B. Vegetarisch, Pasta, Frühstück"
              onkeydown={(e) => e.key === "Enter" && addTag()}
            />
            <button class="add-button compact-button" type="button" onclick={addTag}>
              Hinzufügen
            </button>
          </div>

          {#if tags.length > 0}
            <div class="tag-list">
              {#each tags as item}
                <span class="tag">
                  {item}
                  <button
                    type="button"
                    onclick={() => removeTag(item)}
                    aria-label={`${item} entfernen`}
                  >
                    ×
                  </button>
                </span>
              {/each}
            </div>
          {:else}
            <p class="hint">Noch keine Tags hinzugefügt.</p>
          {/if}
        </div>

        <label class="dropdown-label">
          Basis-Portionen
          <select bind:value={baseServings}>
            <option value={2}>2 Personen</option>
            <option value={4}>4 Personen</option>
          </select>
        </label>
      </div>

      <div class="ingredient-section">
        <div class="input-row">
          <label class="ingredient-name-field" for="ingredient">
            <span class="required-label">Zutaten</span>
            <input
              class:field-error={formSubmitted && ingredients.length === 0}
              id="ingredient"
              bind:value={ingredient}
              placeholder="Zutat, z.B. Spaghetti"
              onkeydown={(e) => e.key === "Enter" && addIngredient()}
            />
          </label>
          <label class="amount-field">
            <span class="required-label">Menge</span>
            <input
              class:field-error={formSubmitted &&
                (ingredients.length === 0 ||
                  ingredients.some((item) => !item.amount.trim()) ||
                  (ingredient.trim() && !ingredientAmount.trim()))}
              bind:value={ingredientAmount}
              placeholder={`${baseServings} Personen, z.B. ${
                baseServings === 2 ? "180 g" : "360 g"
              }`}
              onkeydown={(e) => e.key === "Enter" && addIngredient()}
            />
          </label>
          <button class="add-button compact-button" type="button" onclick={addIngredient}>
              Hinzufügen
          </button>
        </div>

        {#if ingredients.length > 0}
          <div class="ingredient-amount-list">
            <div class="ingredient-amount-header">
              <span>Zutat</span>
              <span>Menge für {baseServings} Personen</span>
              <span></span>
            </div>
            {#each ingredients as item, index}
              <div class="ingredient-amount-item">
                <input
                  class:field-error={formSubmitted && !item.name.trim()}
                  value={item.name}
                  oninput={(event) =>
                    updateIngredientName(index, event.currentTarget.value)}
                  aria-label="Zutat bearbeiten"
                />
                <input
                  class:field-error={formSubmitted && !item.amount.trim()}
                  value={item.amount}
                  oninput={(event) =>
                    updateIngredientAmount(index, event.currentTarget.value)}
                  aria-label="Menge bearbeiten"
                />
                <button
                  type="button"
                  onclick={() => removeIngredient(index)}
                  aria-label={`${item.name} entfernen`}
                >
                  Entfernen
                </button>
              </div>
            {/each}
          </div>
        {:else}
          <p class="hint">Noch keine Zutaten hinzugefügt.</p>
        {/if}
      </div>

      <label>
        <span class="required-label">Zubereitung</span>
        <textarea
          class:field-error={formSubmitted && !instructions.trim()}
          bind:value={instructions}
          placeholder="Beschreibe hier Schritt für Schritt die Zubereitung..."
        ></textarea>
      </label>

      <div class="button-row">
        <button class="primary-button" type="button" disabled={saving} onclick={saveRecipe}>
          {saving ? "Wird gespeichert..." : "Änderungen speichern"}
        </button>
        <a class="secondary-button" href={`/recipes/${page.params.id}`}>Rezept ansehen</a>
      </div>

      {#if successMessage}
        <div class="message">{successMessage}</div>
      {/if}
      {#if errorMessage}
        <div class="error-message">{errorMessage}</div>
      {/if}
    </section>
  {/if}
</main>

<style>
  .dropdown-label {
    position: relative;
  }

  .required-label::after {
    content: " *";
    color: #991b1b;
    font-weight: 900;
  }

  .field-error {
    border-color: #991b1b !important;
  }

  .dropdown-label select {
    padding-right: 2rem;
    background-image: none;
  }

  .dropdown-label::after {
    content: "";
    position: absolute;
    right: 1rem;
    bottom: 1.35rem;
    width: 0.45rem;
    height: 0.45rem;
    border-right: 1.5px solid #1f1d1a;
    border-bottom: 1.5px solid #1f1d1a;
    pointer-events: none;
    transform: rotate(45deg);
  }

  .image-upload-section {
    margin: 0;
  }

  .image-upload-section input[type="file"] {
    padding: 1.05rem 0 1.9rem;
    cursor: pointer;
  }

  .image-preview {
    display: block;
    width: 100%;
    max-height: 180px;
    margin-top: 1rem;
    object-fit: cover;
    border: 1px solid #ece5da;
  }

  .tag-input-row,
  .input-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 0.75rem;
    align-items: end;
    margin-top: 0.5rem;
  }

  .ingredient-section .input-row {
    grid-template-columns: minmax(12rem, 1.4fr) minmax(10rem, 1fr) auto;
  }

  .compact-button {
    width: auto;
    min-width: 8rem;
    min-height: 3.45rem;
    padding: 0 1rem;
    border-radius: 0;
    background: #1f1d1a;
    font-size: 0.95rem;
    font-weight: 900;
  }

  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin-top: 0.8rem;
  }

  .tag-list .tag {
    border: 0;
    border-bottom: 1px solid #cfc7bb;
    border-radius: 0;
    background: transparent;
    color: #302d28;
    font-weight: 650;
  }

  .tag-list .tag button {
    background: transparent;
    color: #68625a;
  }

  .ingredient-name-field,
  .amount-field {
    display: block;
    margin: 0;
  }

  .ingredient-name-field input,
  .amount-field input {
    margin-top: 0.5rem;
  }

  .ingredient-amount-list {
    margin-top: 1.1rem;
    border-top: 1px solid #ece5da;
  }

  .ingredient-amount-header,
  .ingredient-amount-item {
    display: grid;
    grid-template-columns: minmax(12rem, 1.4fr) minmax(10rem, 1fr) auto;
    gap: 0.75rem;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid #ece5da;
  }

  .ingredient-amount-header {
    color: #68625a;
    font-size: 0.85rem;
    font-weight: 750;
  }

  .ingredient-amount-item input {
    padding: 0.45rem 0;
  }

  .ingredient-amount-item button,
  .secondary-button {
    padding: 0.35rem 0;
    border-bottom: 1px solid #cfc7bb;
    background: transparent;
    color: #1f1d1a;
    font-weight: 750;
  }

  .button-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 1rem;
    align-items: center;
  }

  .primary-button:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }

  @media (max-width: 850px) {
    .tag-input-row,
    .ingredient-section .input-row,
    .ingredient-amount-header,
    .ingredient-amount-item,
    .button-row {
      grid-template-columns: 1fr;
    }

    .compact-button {
      width: 100%;
    }
  }

  @media (max-width: 620px) {
    .ingredient-amount-header {
      display: none;
    }
  }
</style>
