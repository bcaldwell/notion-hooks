import { Notion, BlockObjectRequest } from "../notion/notion"
import {
  CreatePageParameters,
} from "@notionhq/client/build/src/api-endpoints"
import { BookHighlights, Highlight } from "./types"
import got from "got"

export async function writeHighlightsToNotion(bookHighlights: BookHighlights, notionDBID: string) {
  // bf8ef5b54da648229f8597ef7e21572d
  const client = new Notion(notionDBID)

  const pageTitle = bookHighlights.book + " - Highlights"
  const databasePageID = await client.getOrCreateDatabasePage(Notion.filterOnTitleProperty(bookHighlights.book), defaultBookPage(bookHighlights))

  // because I am lazy, delete and recreate the page if it exists
  const existingHighlightPageID = await client.getChildPageID(databasePageID, pageTitle)
  if (existingHighlightPageID !== null) {
    await client.deleteBlock(existingHighlightPageID)
  }

  const highlightPageID = await client.createChildPage(databasePageID, pageTitle)

  let children: BlockObjectRequest[] = [
    authorBlock(bookHighlights.author),
    Notion.spacerBlock(),
    Notion.tableofcontentsBlock(),
  ]

  let lastSection = ""
  for (const c of bookHighlights.highlights) {
    if (c.chapter !== lastSection) {
      lastSection = c.chapter
      children.push(Notion.heading2Block(c.chapter))
    }

    children = [...children, ...highlightBlock(c)]
  }

  let children_per_request = 50
  for (let i = 0; i < children.length; i += children_per_request) {
    let start = children_per_request * i
    await client.notion.blocks.children.append({
      block_id: highlightPageID,
      children: children.slice(start, Math.min(start + children_per_request, children.length)),
    })
  }
}

function defaultBookPage(bookHighlights: BookHighlights): (() => Promise<CreatePageParameters>) {
  return async () => {
    const pageCreateRequest: CreatePageParameters = {
      parent: {
        database_id: "",
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: bookHighlights.book,
              },
            },
          ],
        },
        Author: {
          rich_text: [
            {
              text: {
                content: bookHighlights.author,
              },
            },
          ],
        },
      },
      children: [
        Notion.heading2Block("5 Big Ideas"),
        ...Notion.bulletBlock([""]),
        Notion.heading2Block("Summary"),
        Notion.spacerBlock(),
        Notion.heading2Block("Chapter Notes"),
        chapterNotes(),
        Notion.spacerBlock(),
      ],
    }

    const bookCoverURL = await getBookCoverURL(bookHighlights)

    if (bookCoverURL !== null) {
      pageCreateRequest.icon = {
        type: "external",
        external: {
          url: bookCoverURL,
        },
      }

      pageCreateRequest.properties.Cover = {
        type: "files",
        files: [
          {
            name: bookCoverURL,
            ...pageCreateRequest.icon,
          },
        ],
      }
    }

    return pageCreateRequest
  }
}

function authorBlock(author: string): BlockObjectRequest {
  return {
    object: "block",
    type: "paragraph",
    paragraph: {
      rich_text: [
        {
          type: "text",
          text: {
            content: "Authors: ",
          },
          annotations: {
            bold: true,
          },
        },
        {
          type: "text",
          text: {
            content: author,
          },
        },
      ],
    },
  }
}

function chapterNotes(): BlockObjectRequest {
  return {
    type: "toggle",
    toggle: {
      rich_text: [{
        type: "text",
        text: {
          content: " ",
        },
      }],
      children: [{
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [
            {
              type: "text",
              text: {
                content: "Chapter 1",
              },
            },
          ],
        },
      }],
    },
  }
}

function highlightBlock(highlight: Highlight): BlockObjectRequest[] {
  const blocks: BlockObjectRequest[] = [{
    object: "block",
    type: "quote",
    quote: {
      rich_text: [
        {
          type: "text",
          text: {
            content: highlight.highlight + (Number.isNaN(highlight.location) ? "" : " (Location " + highlight.location + ")"),
          },
        },
      ],
    },
  }]

  if (highlight.note) {
    blocks.push({
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            type: "text",
            text: {
              content: highlight.note,
            },
          },
        ],
      },
    })
  }

  blocks.push(Notion.spacerBlock())

  return blocks
}

// https://openlibrary.org/dev/docs/api/covers
// https://covers.openlibrary.org/b/$key/$value-$size.jpg
// https://covers.openlibrary.org/b/ISBN/9781617298318-L.jpg

// https://openlibrary.org/search.json?title=five+lines+of+code

async function getBookCoverURL(bookHighlights: BookHighlights): Promise<string | null> {
  const isbn = await getBookISBN(bookHighlights)
  if (isbn === null) {
    return null
  }

  const coverImageURL = `https://covers.openlibrary.org/b/ISBN/${isbn}-L.jpg`

  const response = await got(coverImageURL)
  if (response.statusCode === 200) {
    return coverImageURL
  }

  return null
}

async function getBookISBN(bookHighlights: BookHighlights): Promise<string | null> {
  const bookTitlesToTry = [
    bookHighlights.book,
    // sometimes the book has a subtitle that breaks it
    bookHighlights.book.split(":")[0],
  ]

  for (const title of bookTitlesToTry.filter((x, i, arr) => onlyUnique(x, i, arr))) {
    const encodedTitle = encodeURI(title)

    // eslint-disable-next-line no-await-in-loop
    const response: openLibrarySearchResponse = await got(`https://openlibrary.org/search.json?title=${encodedTitle}`, {
      parseJson: text => JSON.parse(text),
    }).json()

    if (response.numFound > 0) {
      for (const book of response.docs) {
        if (book.author_name && book.author_name.includes(bookHighlights.author)) {
          return book.isbn[0]
        }
      }
    }
  }

  return null
}

interface openLibrarySearchResponse {
  numFound: number;
  docs: {
    author_name: string[]
    isbn: string[]
  }[];
}

function onlyUnique<T>(value: T, index: number, self: T[]) {
  return self.indexOf(value) === index
}
