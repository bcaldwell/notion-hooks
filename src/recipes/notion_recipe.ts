import { Notion } from "../notion/notion"
import { Recipe } from "./types"

export function createNotionPageForRecipe(recipe: Recipe, notionDBID: string) {
    // "997a1c1a3e3341e792a9dff6252c93a9"
    const client = new Notion(notionDBID);

    client.getOrCreateDatabasePage(Notion.filterOnProperty("URL", recipe.url), async () => {
        return {
            parent: {
                database_id: ""
            },
            properties: {
                Name: {
                    title: text(recipe.name)
                },
                Cuisine: {
                    select: {
                        name: recipe.cuisine || "unknown"
                    }
                },
                Author: {
                    rich_text: text(recipe.author)
                },
                Tags: {
                    multi_select: recipe.keywords.map(k => {
                        return {
                            name: k
                        }
                    })
                },
                Time: {
                    rich_text: text(recipe.time)
                },
                URL: {
                    url: recipe.url
                },
            },
            icon: {
                type: "external",
                external: {
                    url: "https://github.com/bcaldwell/statics/raw/main/icons/notion/recipe-inspiration-icon.png"
                }
            },
            cover: {
                external: {
                    url: recipe.image,
                }
            },
            children: [
                Notion.heading2Block("Ingredients"),
                ...Notion.bulletBlock(recipe.ingredients),
                Notion.heading2Block("Instructions"),
                ...Notion.bulletBlock(recipe.instructions),
            ]
        }
    })
}

type propertyText = {
    text: {
        content: string
    }
}[]

function text(s: string): propertyText {
    return [
        {
            text: {
                content: s,
            },
        },
    ]
}
