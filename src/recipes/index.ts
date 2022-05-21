import { parseRecipeFromURL } from "./parser"
import { createNotionPageForRecipe } from "./notion-recipe"

export async function writeRecipeToNotion(url: string, notionDBID: string) {
  const recipe = await parseRecipeFromURL(cleanURL(url))
  if (recipe === null) {
    console.log("Unable to parse recipe")
    return
  }

  await createNotionPageForRecipe(recipe, notionDBID)
}

function cleanURL(u: string): string {
  const parsedURL = new URL(u)

  // remove trailing slash
  return `${parsedURL.protocol}//${parsedURL.host}${parsedURL.pathname}`.replace(/\/$/, "")
}
