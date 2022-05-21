import { parseHighlightsFromKindleExport } from "./parse"
import { writeHighlightsToNotion } from "./notion-kindle"

export async function writeHighlightsFromKindleExportToNotion(html: string, notionDBID: string) {
  const highlights = parseHighlightsFromKindleExport(html)

  await writeHighlightsToNotion(highlights, notionDBID)
}
