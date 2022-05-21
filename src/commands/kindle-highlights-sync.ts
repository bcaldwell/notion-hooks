import { Command, Flags } from "@oclif/core"
import { writeHighlightsFromKindleExportToNotion } from "../kindle"

export default class KindleHighlightsSync extends Command {
  static description = "Syncs highlights from kindle html export"

  static examples = [
    "<%= config.bin %> <%= command.id %>",
  ]

  static flags = {
    html: Flags.string({ description: "base64 encoded html with highlights", required: true }),
    "notion-db": Flags.string({ description: "notion id of the database to use", required: false }),
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(KindleHighlightsSync)

    const notionDB = flags["notion-db"] || process.env.NOTION_DB_ID
    if (!notionDB) {
      console.log("notion-db flag or NOTION_DB_ID env var needs to be set")
      return
    }

    await writeHighlightsFromKindleExportToNotion(base64Decode(flags.html), notionDB)
  }
}

function base64Decode(s: string): string {
  const b = Buffer.from(s, "base64")

  return b.toString("ascii")
}
