import { parseRecipeFromURL } from "./parser"
import { createNotionPageForRecipe } from "./notion_recipe"
import { Recipe } from "./types"

export async function writeRecipeToNotion(url: string, notionDBID: string) {
    const recipe = await parseRecipeFromURL(url)
    if (!recipe) {
      console.log("Unable to parse recipe")
      return
    }

    return

    // await createNotionPageForRecipe(recipe, notionDBID)
}