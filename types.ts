
export interface Message {
  role: 'user' | 'model';
  content: string;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
}

export interface Recipe {
  name: string;
  ingredients: string[];
  instructions: string[];
  history: string;
}

export enum Tab {
  CHAT = 'chat',
  VISUALS = 'visuals',
  GASTRONOMY = 'gastronomy',
  COFFEE = 'coffee',
  GENNA = 'genna'
}
