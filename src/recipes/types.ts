export interface Recipe {
    name: string;
    author: string;
    image: string;
    instructions: Instructions[];
    keywords: string[];
    ingredients: string[];
    category: string;
    cuisine: string;
    time: string;
    url: string;
    description?: string;
}

export interface Instructions {
    title: string
    instructions: string[]
    isMain: boolean
}
