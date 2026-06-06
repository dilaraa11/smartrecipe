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
  .image-upload-section input[type="file"] {
    padding-bottom: 1.9rem;
  }
</style>
