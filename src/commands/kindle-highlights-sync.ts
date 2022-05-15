import {Command, Flags} from '@oclif/core'
import {writeHighlightsFromKindleExportToNotion} from "../kindle"

export default class KindleHighlightsSync extends Command {
  static description = 'Syncs highlights from kindle html export'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    html: Flags.string({ description: 'base64 encoded html with highlights', required: true }),
    "notion-db": Flags.string({ description: 'notion id of the database to use', required: true}),
  }

  static args = [{name: 'file'}]

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(KindleHighlightsSync)

    await writeHighlightsFromKindleExportToNotion(base64Decode(flags.html), flags['notion-db'])
  }

}

function base64Decode(s: string): string {
  let b = Buffer.from(s, 'base64');

  return b.toString('ascii')
}