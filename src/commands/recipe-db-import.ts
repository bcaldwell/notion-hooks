import { Command, Flags } from '@oclif/core'
import { parseRecipeFromURL, createNotionPageForRecipe } from "../recipes"

export default class RecipeDbImport extends Command {
  static description = 'imports recipe from a website to a notion db'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    url: Flags.string({ description: 'url path to recipe', required: true }),
  }

  // static args = [{name: 'file'}]

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(RecipeDbImport)

    const url = flags.url

    const recipe = await parseRecipeFromURL(url)
    if (!recipe) {
      console.log("Unable to parse recipe")
      return
    }

    await createNotionPageForRecipe(recipe)
    // console.log(JSON.stringify(recipe, null, 2));
  }

}

