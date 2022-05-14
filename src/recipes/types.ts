export interface Recipe {
    name: string;
    author: string;
    image: string;
    instructions: string[];
    keywords: string[];
    ingredients: string[];
    category: string;
    cuisine: string;
    time: string;
    url: string;
    description?: string;
}