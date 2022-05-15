import { Command, Flags } from '@oclif/core'
import { writeRecipeToNotion } from "../recipes"

export default class RecipeImport extends Command {
  static description = 'imports recipe from a website to a notion db'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    url: Flags.string({ description: 'url path to recipe', required: true }),
    "notion-db": Flags.string({ description: 'notion id of the database to use', required: true}),
  }

  // static args = [{name: 'file'}]

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(RecipeImport)

    await writeRecipeToNotion(flags.url, flags['notion-db'])
  }

}

