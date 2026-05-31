export type Recipe = {
  _id?: string;
  id?: number;
  title: string;
  time: number;
  difficulty: 'Einfach' | 'Mittel' | 'Schwer';
  tags: string[];
  ingredients: string[];
  ingredientAmounts?: {
    name: string;
    amount2: string;
    amount4: string;
  }[];
  emoji: string;
  imageUrl?: string;
  category: string;
  instructions: string;
  favorite?: boolean;
};
