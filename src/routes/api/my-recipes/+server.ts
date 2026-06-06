import { json } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { getSessionUserId } from '$lib/server/session';
import type { Cookies } from '@sveltejs/kit';

function scaleAmount(amount: string, factor: number) {
  const match = amount.match(/(\d+(?:[.,]\d+)?)/);

  if (!match) {
    return amount;
  }

  const originalNumber = match[1];
  const scaled = Number(originalNumber.replace(',', '.')) * factor;
  const formatted = Number.isInteger(scaled)
    ? String(scaled)
    : scaled.toFixed(1).replace(/\.0$/, '');
  const localized = originalNumber.includes(',')
    ? formatted.replace('.', ',')
    : formatted;

  return amount.replace(originalNumber, localized);
}

function getIngredientAmounts(
  ingredients: (string | {
    name?: string;
    amount?: string;
    menge_2_personen?: string;
    menge_4_personen?: string;
  })[],
  baseServings: 2 | 4,
) {
  return ingredients
    .filter((ingredient) => typeof ingredient !== 'string')
    .map((ingredient) => {
      if (ingredient.menge_2_personen || ingredient.menge_4_personen) {
        return {
          name: ingredient.name ?? '',
          amount2: ingredient.menge_2_personen ?? '',
          amount4: ingredient.menge_4_personen ?? '',
        };
      }

      const amount = ingredient.amount ?? '';

      return {
        name: ingredient.name ?? '',
        amount2: baseServings === 2 ? amount : scaleAmount(amount, 0.5),
        amount4: baseServings === 4 ? amount : scaleAmount(amount, 2),
      };
    });
}

function normalizeRecipe(recipe: any) {
  const tags = recipe.tags ?? recipe.kategorien ?? [];
  const ingredients = recipe.ingredients ?? recipe.zutaten ?? [];
  const baseServings = recipe.baseServings === 4 ? 4 : 2;

  return {
    _id: recipe._id,
    title: recipe.title ?? recipe.rezeptname ?? 'Unbenanntes Rezept',
    time: recipe.time ?? recipe.dauer_in_minuten ?? 0,
    difficulty: recipe.difficulty ?? recipe.schwierigkeit ?? 'Einfach',
    tags,
    ingredients: ingredients.map((ingredient: string | { name?: string }) =>
      typeof ingredient === 'string' ? ingredient : ingredient.name ?? '',
    ),
    ingredientAmounts: getIngredientAmounts(ingredients, baseServings),
    emoji: recipe.emoji ?? '',
    imageUrl: recipe.imageUrl ?? recipe.image_url ?? recipe.bildUrl ?? recipe.bild_url ?? '',
    category: recipe.category ?? tags[0] ?? '',
    instructions: recipe.instructions ?? recipe.zubereitung ?? '',
    favorite: recipe.favorite ?? false,
  };
}

export async function GET({ cookies }: { cookies: Cookies }) {
  try {
    const userId = getSessionUserId(cookies);

    if (!userId) {
      return json(
        { error: 'Bitte einloggen, um deine Rezepte zu sehen.' },
        { status: 401 },
      );
    }

    const db = await getDb();
    const recipes = await db
      .collection('recipes')
      .find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .toArray();

    return json(recipes.map(normalizeRecipe));
  } catch (error) {
    console.error(error);
    return json({ error: 'Fehler beim Laden deiner Rezepte' }, { status: 500 });
  }
}
