import { BookHighlights } from "./types"
import { parse } from "node-html-parser"

export function parseHighlightsFromKindleExport(kindleExportContents: string): BookHighlights {
  const bookHighlights: BookHighlights = {
    book: "",
    author: "",
    highlights: [],
  }

  const root = parse(kindleExportContents)

  const body = root.querySelector(".bodyContainer")
  if (body === null) {
    return bookHighlights
  }

  let section = ""
  let location = Number.NaN
  let noteType = ""
  for (const e of body.childNodes) {
    if (e.nodeType !== 1) {
      continue
    }

    const elm = e as any as HTMLElement

    if (elm.classList.contains("bookTitle")) {
      bookHighlights.book = getTrimmedContent(elm)
      noteType = ""
    } else if (elm.classList.contains("authors")) {
      bookHighlights.author = getTrimmedContent(elm)
      noteType = ""
    } else if (elm.classList.contains("sectionHeading")) {
      section = getTrimmedContent(elm)
      noteType = ""
    } else if (elm.classList.contains("noteHeading")) {
      // console.log(getTrimmedContent(elm).match(/- Location (\d+)/)[1])
      const locationMatch = getTrimmedContent(elm).match(/- Location (\d+)/)
      location = (locationMatch && locationMatch.length >= 2) ? Number(locationMatch[1]) : Number.NaN

      if (getTextContent(elm).includes("Highlight")) {
        noteType = "Highlight"
      } else if (getTextContent(elm).includes("Note")) {
        noteType = "Note"
      }
    } else if (elm.classList.contains("noteText")) {
      if (noteType === "Highlight") {
        bookHighlights.highlights.push({
          chapter: section,
          location: location,
          // clean non ascii unicode crap
          highlight: getTrimmedContent(elm).replace(/\n\s*/g, " "),
        })
      } else if (noteType === "Note") {
        bookHighlights.highlights[bookHighlights.highlights.length - 1].note = getTrimmedContent(elm).replace(/\n\s*/g, " ")
      }

      noteType = ""
    }
  }

  return bookHighlights
}

function getTextContent(elm: HTMLElement): string {
  return (elm.textContent || "")
}

function getTrimmedContent(elm: HTMLElement): string {
  return getTextContent(elm).trim()
}
