import { BlockObjectRequest, Notion } from "../notion/notion"
import { Recipe, Instructions } from "./types"

export function createNotionPageForRecipe(recipe: Recipe, notionDBID: string) {
  // "997a1c1a3e3341e792a9dff6252c93a9"
  const client = new Notion(notionDBID)

  client.getOrCreateDatabasePage(Notion.filterOnProperty("URL", recipe.url), async () => {
    return {
      parent: {
        database_id: "",
      },
      properties: {
        Name: {
          title: text(recipe.name),
        },
        Cuisine: {
          select: {
            name: recipe.cuisine || "unknown",
          },
        },
        Author: {
          rich_text: text(recipe.author),
        },
        Tags: {
          multi_select: recipe.keywords.map(k => {
            return {
              name: k,
            }
          }),
        },
        Time: {
          rich_text: text(recipe.time),
        },
        URL: {
          url: recipe.url,
        },
      },
      icon: {
        type: "external",
        external: {
          url: "https://github.com/bcaldwell/statics/raw/main/icons/notion/recipe-inspiration-icon.png",
        },
      },
      cover: {
        external: {
          url: recipe.image,
        },
      },
      children: [
        Notion.heading2Block("Ingredients"),
        ...Notion.bulletBlock(recipe.ingredients),
        ...getRecipeInstructions(recipe.instructions),
      ],
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

function getRecipeInstructions(instructions: Instructions[]): BlockObjectRequest[] {
  const mainSet = instructions.filter(x => x.isMain)
  const nonMainSet = instructions.filter(x => !x.isMain)
  let blocks: BlockObjectRequest[] = [Notion.heading2Block("Instructions")]

  for (const set of mainSet) {
    blocks = [...blocks, ...Notion.bulletBlock(set.instructions)]
  }

  for (const set of nonMainSet) {
    blocks = [...blocks, Notion.heading3Block("Instructions - " + set.title), ...Notion.bulletBlock(set.instructions)]
  }

  return blocks
}
