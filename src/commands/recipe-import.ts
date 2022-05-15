import { Command, Flags } from '@oclif/core'
import { writeRecipeToNotion } from "../recipes"

export default class RecipeImport extends Command {
  static description = 'imports recipe from a website to a notion db'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    url: Flags.string({ description: 'url path to recipe', required: true }),
    "notion-db": Flags.string({ description: 'notion id of the database to use', required: false}),
  }

  
  public async run(): Promise<void> {
    const { args, flags } = await this.parse(RecipeImport)

    const notionDB = flags["notion-db"] || process.env.NOTION_DB_ID
      if (!notionDB) {
        console.log("notion-db flag or NOTION_DB_ID env var needs to be set")
        return
      }

    await writeRecipeToNotion(flags.url, notionDB)
  }

}

