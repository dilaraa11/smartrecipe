<script lang="ts">
  let title = $state("");
  let time = $state("");
  let difficulty = $state("Einfach");
  let category = $state("");
  let ingredient = $state("");
  let ingredients = $state<string[]>([]);
  let instructions = $state("");
  let successMessage = $state("");
  let errorMessage = $state("");
  let loadingUser = $state(true);
  let isLoggedIn = $state(false);

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
    const cleaned = ingredient.trim();

    if (cleaned && !ingredients.includes(cleaned)) {
      ingredients = [...ingredients, cleaned];
      ingredient = "";
    }
  }

  function removeIngredient(item: string) {
    ingredients = ingredients.filter((i) => i !== item);
  }

  async function saveRecipe() {
    successMessage = "";
    errorMessage = "";

    const recipe = {
      title,
      time: Number(time),
      difficulty,
      category,
      tags: [category],
      ingredients,
      emoji: "",
      instructions,
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
      category = "";
      ingredients = [];
      instructions = "";
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
          Rezeptname
          <input bind:value={title} placeholder="z.B. Tomaten-Omelett" />
        </label>

        <label>
          Dauer in Minuten
          <input bind:value={time} type="number" placeholder="z.B. 20" />
        </label>

        <label>
          Schwierigkeit
          <select bind:value={difficulty}>
            <option>Einfach</option>
            <option>Mittel</option>
            <option>Schwer</option>
          </select>
        </label>

        <label>
          Kategorie
          <input
            bind:value={category}
            placeholder="z.B. Vegetarisch, Pasta, Frühstück"
          />
        </label>
      </div>

      <div class="ingredient-section">
        <label for="ingredient">Zutaten</label>

        <div class="input-row">
          <input
            id="ingredient"
            bind:value={ingredient}
            placeholder="z.B. Eier"
            onkeydown={(e) => e.key === "Enter" && addIngredient()}
          />
          <button class="add-button" onclick={addIngredient}>+</button>
        </div>

        {#if ingredients.length > 0}
          <div class="ingredients">
            {#each ingredients as item}
              <span class="tag">
                {item}
                <button onclick={() => removeIngredient(item)}>×</button>
              </span>
            {/each}
          </div>
        {:else}
          <p class="hint">Noch keine Zutaten hinzugefügt.</p>
        {/if}
      </div>

      <label>
        Zubereitung
        <textarea
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
