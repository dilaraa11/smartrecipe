<script lang="ts">
    import { page } from "$app/state";
    import type { Recipe } from "$lib/types/recipe";

    let recipe = $state<Recipe | null>(null);
    let loading = $state(true);
    let error = $state("");

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
        }
    }

    $effect(() => {
        loadRecipe();
    });
</script>

<main class="page">
    <a class="back-button" href="/recipes"> ← Zurück zu Rezepten </a>
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
                <div class="emoji">{recipe.emoji}</div>

                <div>
                    <p class="eyebrow">{recipe.category}</p>
                    <h1>{recipe.title}</h1>

                    <div class="meta">
                        <span>⏱ {recipe.time} Minuten</span>
                        <span>⭐ {recipe.difficulty}</span>
                    </div>
                    <button class="favorite-button" onclick={toggleFavorite}>
                        {recipe.favorite
                            ? "❤️ Favorit entfernen"
                            : "🤍 Als Favorit speichern"}
                    </button>
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
        display: flex;
        gap: 1.5rem;
        align-items: center;
        margin-bottom: 2rem;
    }

    .recipe-detail .emoji {
        width: 7rem;
        height: 7rem;
        border-radius: 2rem;
        background: rgba(255, 255, 255, 0.7);
        font-size: 3rem;
    }

    .recipe-detail .eyebrow {
        margin-bottom: 0.5rem;
        color: #c2410c;
    }

    .recipe-detail .meta {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
        color: #6b5b4a;
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

    @media (max-width: 700px) {
        .recipe-detail .hero {
            flex-direction: column;
            align-items: flex-start;
        }
    }
</style>
