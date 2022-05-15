import { BookHighlights } from "./types";
import { parse } from "node-html-parser";

export function parseHighlightsFromKindleExport(kindleExportContents: string): BookHighlights {
    let bookHighlights: BookHighlights = {
        book: "",
        author: "",
        highlights: [],
    }

    const root = parse(kindleExportContents);

    const body = root.querySelector(".bodyContainer")
    if (body === null) {
        return bookHighlights
    }

    let section = ""
    let location = NaN
    let noteType = ""
    for (let e of body.childNodes) {
        if (e.nodeType !== 1) {
            continue
        }

        let elm = e as any as HTMLElement

        if (elm.classList.contains("bookTitle")) {
            bookHighlights.book = elm.innerText.trim()
            noteType = ""
        } else if (elm.classList.contains("authors")) {
            bookHighlights.author = elm.innerText.trim()
            noteType = ""
        } else if (elm.classList.contains("sectionHeading")) {
            section = elm.innerText.trim()
            noteType = ""
        } else if (elm.classList.contains("noteHeading")) {
            // console.log(elm.innerText.trim().match(/- Location (\d+)/)[1])
            let locationMatch = elm.innerText.trim().match(/- Location (\d+)/)
            location = (locationMatch && locationMatch.length >= 2) ? Number(locationMatch[1]) : NaN

            if (elm.innerText.includes("Highlight")) {
                noteType = "Highlight"
            } else if (elm.innerText.includes("Note")) {
                noteType = "Note"
            }
        } else if (elm.classList.contains("noteText")) {
            if (noteType === "Highlight") {
                bookHighlights.highlights.push({
                    chapter: section,
                    location: location,
                    highlight: elm.innerText.trim().replace(/\n\s*/g, " "),
                })
            } else if (noteType === "Note") {
                bookHighlights.highlights[bookHighlights.highlights.length - 1].note = elm.innerText.trim().replace(/\n\s*/g, " ")
            }
            noteType = ""
        }
    }

    return bookHighlights
}