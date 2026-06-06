<script lang="ts">
  let title = $state("");
  let time = $state("");
  let difficulty = $state("Einfach");
  let tag = $state("");
  let tags = $state<string[]>([]);
  let baseServings = $state<2 | 4>(2);
  let ingredient = $state("");
  let ingredientAmount = $state("");
  let ingredients = $state<
    {
      name: string;
      amount: string;
    }[]
  >([]);
  let imageUrl = $state("");
  let instructions = $state("");
  let successMessage = $state("");
  let errorMessage = $state("");
  let loadingUser = $state(true);
  let isLoggedIn = $state(false);
  let formSubmitted = $state(false);

  async function loadCurrentUser() {
    try {
      const response = await fetch("/api/auth/me");
      const result = await response.json();

      isLoggedIn = Boolean(result.user);
    } catch {
      isLoggedIn = false;
    } finally {
      loadingUser = false;
    }
  }

  $effect(() => {
    loadCurrentUser();
  });

  function addIngredient() {
    const cleanedName = ingredient.trim();
    const cleanedAmount = ingredientAmount.trim();

    if (cleanedName && !cleanedAmount) {
      errorMessage = "Bitte gib eine Menge zur Zutat ein.";
      return;
    }

    if (
      cleanedName &&
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
      ingredient = "";
      ingredientAmount = "";
      errorMessage = "";
    }
  }

  function removeIngredient(name: string) {
    ingredients = ingredients.filter((item) => item.name !== name);
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
    if (ingredients.length === 0) missingFields.push("Zutaten");
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

    const recipe = {
      title: title.trim(),
      time: Number(time),
      difficulty,
      category: tags[0] ?? "",
      baseServings,
      tags,
      ingredients,
      emoji: "",
      imageUrl,
      instructions: instructions.trim(),
    };

    const response = await fetch("/api/recipes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipe),
    });

    if (response.ok) {
      successMessage = "Rezept wurde erfolgreich gespeichert!";
      title = "";
      time = "";
      difficulty = "Einfach";
      tag = "";
      tags = [];
      baseServings = 2;
      ingredient = "";
      ingredientAmount = "";
      ingredients = [];
      imageUrl = "";
      instructions = "";
      formSubmitted = false;
    } else if (response.status === 401) {
      errorMessage = "Bitte logge dich ein, um Rezepte zu erstellen.";
    } else {
      const result = await response.json();
      errorMessage = result.error ?? "Fehler beim Speichern.";
    }
  }
</script>

<main class="page">
  <a class="back-button" href="/">Zurück zur Startseite</a>

  <section class="header">
    <p class="eyebrow">Eigenes Rezept</p>
    <h1>Rezept erstellen</h1>
    <p>
      Erfasse ein eigenes Rezept mit Zutaten, Zubereitung und
      Basisinformationen. Danach kannst du es jederzeit wiederfinden.
    </p>
  </section>

  {#if loadingUser}
    <section class="status-card">
      <p>Benutzerstatus wird geprüft...</p>
    </section>
  {:else if !isLoggedIn}
    <section class="empty-card">
      <h2>Bitte einloggen</h2>
      <p>
        Du brauchst ein Konto, um eigene Rezepte zu erstellen und später wieder
        zu finden.
      </p>
      <a href="/login">Einloggen oder registrieren</a>
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
            aria-required="true"
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
            aria-required="true"
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
            <button class="add-button tag-add-button" type="button" onclick={addTag}>
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
          <button class="add-button ingredient-add-button" onclick={addIngredient}>
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
            {#each ingredients as item}
              <div class="ingredient-amount-item">
                <span>{item.name}</span>
                <strong class:field-text-error={formSubmitted && !item.amount.trim()}>
                  {item.amount || "Menge fehlt"}
                </strong>
                <button
                  type="button"
                  onclick={() => removeIngredient(item.name)}
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

      <button class="primary-button" onclick={saveRecipe}>
        Rezept speichern
      </button>

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

  .field-text-error {
    color: #991b1b !important;
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

  .ingredient-add-button {
    width: auto;
    min-width: 8rem;
    min-height: 3.45rem;
    padding: 0 1rem;
    border-radius: 0;
    background: #1f1d1a;
    font-size: 0.95rem;
    font-weight: 900;
  }

  .image-upload-section {
    margin: 0;
  }

  .image-upload-section input[type="file"] {
    padding: 1.05rem 0 1.3rem;
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

  .tag-section {
    min-width: 0;
  }

  .tag-input-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 0.75rem;
    align-items: stretch;
    margin-top: 0.5rem;
  }

  .tag-add-button {
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

  .ingredient-section .input-row {
    display: grid;
    grid-template-columns: minmax(12rem, 1.4fr) minmax(10rem, 1fr) auto;
    gap: 0.75rem;
    align-items: end;
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

  .ingredient-amount-item strong {
    color: #1f1d1a;
    font-weight: 750;
  }

  .ingredient-amount-item button {
    padding: 0.35rem 0;
    border-bottom: 1px solid #cfc7bb;
    background: transparent;
    color: #1f1d1a;
    font-size: 0.85rem;
    font-weight: 750;
  }

  .ingredient-amount-item button:hover {
    color: #8a624b;
  }

  @media (max-width: 850px) {
    .ingredient-section .input-row,
    .ingredient-amount-header,
    .ingredient-amount-item {
      grid-template-columns: 1fr 1fr;
    }

    .ingredient-add-button {
      width: 100%;
    }

    .tag-input-row {
      grid-template-columns: 1fr;
    }

    .tag-add-button {
      width: 100%;
    }
  }

  @media (max-width: 620px) {
    .ingredient-section .input-row,
    .ingredient-amount-header,
    .ingredient-amount-item {
      grid-template-columns: 1fr;
    }

    .ingredient-amount-header {
      display: none;
    }
  }
</style>
