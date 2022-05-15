import { Client } from '@notionhq/client';
import {
    CreatePageParameters,
    QueryDatabaseParameters,
    ListBlockChildrenResponse,
} from "@notionhq/client/build/src/api-endpoints"

export type QueryDatabaseFilter = QueryDatabaseParameters['filter']
export type BlockObjectRequest = Exclude<CreatePageParameters["children"], undefined>[number];
export type Block = ListBlockChildrenResponse['results'][number];

type getCreatePageParameters = () => Promise<CreatePageParameters>;

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

        const page = await pageCreateRequest()
        page.parent = {
            database_id: this.databaseID,
        }

        const createResponse = await this.notion.pages.create(page);

        return createResponse.id;
    }

    async getOrCreateChildPage(pageID: string, name: string): Promise<string> {
        let hasMore = true

        while (hasMore) {
            const response = await this.notion.blocks.children.list({
                block_id: pageID,
                page_size: 100,
            });

            hasMore = response.has_more

            for (let block of response.results) {
                if ("child_page" in block && block.child_page.title === name) {
                    return block.id
                }
            }
        }

        const response = await this.notion.pages.create({
            parent: {
                page_id: pageID,
            },
            properties: {
                'title': [
                    {
                        type: 'text',
                        text: {
                            content: name,
                        },
                    },
                ],
            },
        });

        return response.id
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
                bulleted_list_item: {
                    rich_text: [{
                        type: "text",
                        text: {
                            "content": s,
                            "link": null
                        }
                    }]
                }
            }
        })
    }

    static tableofcontentsBlock(): BlockObjectRequest {
        return {
            type: "toggle",
            toggle: {
                rich_text: [{
                    type: "text",
                    text: {
                        content: "Table of Contents",
                    }
                }],
                children: [{
                    type: "table_of_contents",
                    table_of_contents: {},
                }]
            }
        }
    }
};
