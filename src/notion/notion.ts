import { Client } from '@notionhq/client';
import {
    CreatePageParameters,
    QueryDatabaseParameters,
    ListBlockChildrenResponse,
} from "@notionhq/client/build/src/api-endpoints"
// import { BookHighlights, Highlight } from './types';
import got from 'got';

// // const databaseID = "bf8ef5b54da648229f8597ef7e21572d"
// const databaseID = "997a1c1a3e3341e792a9dff6252c93a9"

export type QueryDatabaseFilter = QueryDatabaseParameters['filter']
export type BlockObjectRequest = Exclude<CreatePageParameters["children"], undefined>[number];
export type Block = ListBlockChildrenResponse['results'][number];

type getCreatePageParameters = () => CreatePageParameters;

export class Notion {
    notion: Client;
    databaseID: string;

    constructor(databaseID: string) {
        this.notion = new Client({ auth: process.env.NOTION_API_KEY });
        this.databaseID = databaseID;
    }

    static filterOnTitleProperty(title: string): QueryDatabaseFilter {
        return this.filterOnProperty("title", title)
    }

    static filterOnProperty(key: string, value: string): QueryDatabaseFilter {
        return {
            and: [
                {
                    property: key,
                    title: {
                        equals: value,
                    },
                },
            ],
        }

    }

    async getOrCreateDatabasePage(filter: QueryDatabaseFilter, pageCreateRequest: getCreatePageParameters): Promise<string> {
        const response = await this.notion.databases.query(
            {
                database_id: this.databaseID,
                filter: filter
            }
        );

        if (response.results.length > 0) {
            return response.results[0].id
        }

        const page = pageCreateRequest()
        page.parent = {
            database_id: this.databaseID,
        }

        const createResponse = await this.notion.pages.create(page);

        return createResponse.id;
    }

    static heading2Block(name: string): BlockObjectRequest {
        return {
            object: 'block',
            type: 'heading_2',
            heading_2: {
                rich_text: [
                    {
                        type: 'text',
                        text: {
                            content: name,
                        },
                    },
                ],
            },
        }
    }

    static spacerBlock(): BlockObjectRequest {
        return {
            object: 'block',
            type: 'paragraph',
            paragraph: {
                rich_text: [
                    {
                        type: 'text',
                        text: {
                            content: "",
                        },
                    },
                ],
            }
        }
    }

    static bulletBlock(items: string[]): BlockObjectRequest[] {
        return items.map(s => {
            return {
                object: 'block',
                type: 'bulleted_list_item',
                "bulleted_list_item": {
                    "rich_text": [{
                        "type": "text",
                        "text": {
                            "content": s,
                            "link": null
                        }
                    }]
                }
            }
        })
    };
}
//     async writeHighlightsToNotion(bookHighlights: BookHighlights) {
//         const pageTitle = bookHighlights.book + " - Highlights"
//         const databasePageID = await this.getOrCreateDatabasePage(bookHighlights)

//         const highlightPageID = await this.getOrCreateChildPage(databasePageID, pageTitle)

//         // BlockObjectRequest is unexported so yeah
//         let children: BlockObjectRequest[] = [
//             authorBlock(bookHighlights.author),
//             spacerBlock(),
//             tableofcontentsBlock()
//         ];

//         let lastSection = ""
//         for (let c of bookHighlights.highlights) {
//             if (c.chapter != lastSection) {
//                 lastSection = c.chapter
//                 children.push(heading2Block(c.chapter))
//             }

//             children = children.concat(highlightBlock(c))
//         }


//         const appendResponse = await this.notion.blocks.children.append({
//             block_id: highlightPageID,
//             children: children,
//         });
//         // console.log(appendResponse);
//     }

//     async getOrCreateDatabasePage(bookHighlights: BookHighlights): Promise<string> {
//         const response = await this.notion.databases.query({
//             database_id: databaseID,
//             filter: {
//                 and: [
//                     {
//                         property: "title",
//                         text: {
//                             equals: bookHighlights.book,
//                         },

//                     },
//                 ],
//             },
//         });

//         if (response.results.length > 0) {
//             return response.results[0].id
//         }

//         const bookCoverURL = await getBookCoverURL(bookHighlights)

//         const pageCreateRequest: CreatePageBodyParameters = {
//             parent: {
//                 database_id: databaseID,
//             },
//             properties: {
//                 Name: {
//                     title: [
//                         {
//                             text: {
//                                 content: bookHighlights.book,
//                             },
//                         },
//                     ],
//                 },
//                 Author: {
//                     rich_text: [
//                         {
//                             text: {
//                                 content: bookHighlights.author,
//                             },
//                         },
//                     ],
//                 },
//             },
//             children: [
//                 heading2Block("5 Big Ideas"),
//                 bulletBlock(),
//                 heading2Block("Summary"),
//                 spacerBlock(),
//                 heading2Block("Chapter Notes"),
//                 chapterNotes(),
//                 spacerBlock(),
//             ],
//         }

//         if (bookCoverURL !== null) {
//             pageCreateRequest.icon = {
//                 type: "external",
//                 external: {
//                     url: bookCoverURL
//                 }
//             }

//             pageCreateRequest.properties.Cover = {
//                 type: "files",
//                 files: [
//                     {
//                         name: bookCoverURL,
//                         ...pageCreateRequest.icon
//                     }
//                 ]
//             }
//         }

//         const createResponse = await this.notion.pages.create(pageCreateRequest);

//         return createResponse.id;
//     }

//     async getOrCreateChildPage(pageID: string, name: string): Promise<string> {
//         let startCursor = 0;
//         let hasMore = true

//         while (hasMore) {
//             const response = await this.notion.blocks.children.list({
//                 block_id: pageID,
//                 page_size: 100,
//             });

//             hasMore = response.has_more

//             for (let block of response.results) {
//                 if ("child_page" in block && block.child_page.title === name) {
//                     return block.id
//                 }
//             }
//         }

//         const response = await this.notion.pages.create({
//             parent: {
//                 page_id: pageID,
//             },
//             properties: {
//                 'title': [
//                     {
//                         type: 'text',
//                         text: {
//                             content: name,
//                         },
//                     },
//                 ],
//             },
//         });

//         return response.id
//     }
// }

// function authorBlock(author: string): BlockObjectRequest {
//     return {
//         object: 'block',
//         type: 'paragraph',
//         paragraph: {
//             text: [
//                 {
//                     type: 'text',
//                     text: {
//                         content: "Authors: ",
//                     },
//                     annotations: {
//                         bold: true,
//                     }
//                 },
//                 {
//                     type: 'text',
//                     text: {
//                         content: author,
//                     },
//                 },
//             ],
//         },
//     }
// }

// function tableofcontentsBlock(): BlockObjectRequest {
//     return {
//         type: "toggle",
//         toggle: {
//             text: [{
//                 type: "text",
//                 text: {
//                     content: "Table of Contents",
//                 }
//             }],
//             children: [{
//                 type: "table_of_contents",
//                 table_of_contents: {},
//             }]
//         }
//     }
// }

// function spacerBlock(): BlockObjectRequest {
//     return {
//         object: 'block',
//         type: 'paragraph',
//         paragraph: {
//             text: [
//                 {
//                     type: 'text',
//                     text: {
//                         content: "",
//                     },
//                 },
//             ],
//         }
//     }
// }

// function bulletBlock(): BlockObjectRequest {
//     return {
//         object: 'block',
//         type: 'bulleted_list_item',
//         bulleted_list_item: {
//             text: [],
//         }
//     }
// }



// function chapterNotes(): BlockObjectRequest {
//     return {
//         type: "toggle",
//         toggle: {
//             text: [{
//                 type: 'text',
//                 text: {
//                     content: " ",
//                 },
//             },],
//             children: [{
//                 object: 'block',
//                 type: 'heading_2',
//                 heading_2: {
//                     text: [
//                         {
//                             type: 'text',
//                             text: {
//                                 content: "Chapter 1",
//                             },
//                         },
//                     ],
//                 },
//             }]
//         }
//     }
// }

// function highlightBlock(highlight: Highlight): BlockObjectRequest[] {
//     const blocks: BlockObjectRequest[] = [{
//         object: 'block',
//         type: 'quote',
//         quote: {
//             text: [
//                 {
//                     type: 'text',
//                     text: {
//                         content: highlight.highlight + (isNaN(highlight.location) ? "" : " (Location " + highlight.location + ")"),
//                     },
//                 },
//             ],
//         },
//     }]

//     if (highlight.note) {
//         blocks.push({
//             object: 'block',
//             type: 'paragraph',
//             paragraph: {
//                 text: [
//                     {
//                         type: 'text',
//                         text: {
//                             content: highlight.note,
//                         },
//                     },
//                 ],
//             },
//         })
//     }

//     blocks.push(spacerBlock())

//     return blocks
// }

// // https://openlibrary.org/dev/docs/api/covers
// // https://covers.openlibrary.org/b/$key/$value-$size.jpg
// // https://covers.openlibrary.org/b/ISBN/9781617298318-L.jpg

// // https://openlibrary.org/search.json?title=five+lines+of+code

// async function getBookCoverURL(bookHighlights: BookHighlights): Promise<string | null> {
//     const isbn = await getBookISBN(bookHighlights)
//     if (isbn === null) {
//         return null
//     }

//     const coverImageURL = `https://covers.openlibrary.org/b/ISBN/${isbn}-L.jpg`

//     const response = await got(coverImageURL)
//     if (response.statusCode === 200) {
//         return coverImageURL
//     }

//     return null
// }

// async function getBookISBN(bookHighlights: BookHighlights): Promise<string | null> {
//     const bookTitlesToTry = [
//         bookHighlights.book,
//         // sometimes the book has a subtitle that breaks it
//         bookHighlights.book.split(":")[0]
//     ]

//     for (let title of bookTitlesToTry.filter(onlyUnique)) {
//         const encodedTitle = encodeURI(title)

//         const response: openLibrarySearchResponse = await got(`https://openlibrary.org/search.json?title=${encodedTitle}`, {
//             parseJson: text => JSON.parse(text)
//         }).json();

//         if (response.numFound > 0) {
//             for (let book of response.docs) {
//                 if (book.author_name.indexOf(bookHighlights.author) !== -1) {
//                     return book.isbn[0]
//                 }
//             }
//         }
//     }
//     return null
// }

// interface openLibrarySearchResponse {
//     numFound: Number;
//     docs: {
//         author_name: string[]
//         isbn: string[]
//     }[];
// }


// function onlyUnique<T>(value: T, index: Number, self: T[]) {
//     return self.indexOf(value) === index;
// }
