export type Recipe = {
  _id?: string;
  id?: number;
  title: string;
  time: number;
  difficulty: 'Einfach' | 'Mittel' | 'Schwer';
  tags: string[];
  ingredients: string[];
  emoji: string;
  category: string;
  instructions: string;
  favorite?: boolean;
};