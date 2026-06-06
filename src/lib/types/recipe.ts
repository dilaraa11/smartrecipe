export type Recipe = {
  _id?: string;
  id?: number;
  title: string;
  time: number;
  difficulty: 'Einfach' | 'Mittel' | 'Schwer';
  tags: string[];
  ingredients: string[];
  ingredientDetails?: {
    name: string;
    amount: string;
  }[];
  ingredientAmounts?: {
    name: string;
    amount2: string;
    amount4: string;
  }[];
  emoji: string;
  imageUrl?: string;
  category: string;
  baseServings?: 2 | 4;
  instructions: string;
  favorite?: boolean;
  createdByUsername?: string;
  createdByCurrentUser?: boolean;
};
