import got from 'got';
// import { parse, HTMLElement } from 'node-html-parser';
import jsonld from 'jsonld';

import { Recipe } from "./types"
import { JSDOM } from "jsdom"
import { Recipe as RecipeSchema } from "schema-dts"
import { microdata } from '@cucumber/microdata';
import { url } from 'inspector';

const recipeContext = {
    "@context": {
        "author": {
            "@id": "http://schema.org/author"
        },
        "description": "http://schema.org/description",
        "image": "http://schema.org/image",
        "instructions": "http://schema.org/recipeInstructions",
        "keywords": "http://schema.org/keywords",
        "ingredients": "http://schema.org/recipeIngredient",
        "category": "http://schema.org/recipeCategory",
        "cuisine": "http://schema.org/recipeCuisine",
        "time": "http://schema.org/totalTime",
        "url": "http://schema.org/url",
        "name": "http://schema.org/name"
    }
};

export async function parseRecipeFromURL(url: string): Promise<Recipe | null> {
    const siteHTML = await got.get(url).text();
    // const parsedHTML = parse(siteHTML)
    const dom = new JSDOM(siteHTML)

    // check error...
    const recipeBlock = await getRecipeJSONLD(dom.window.document)
    if (!recipeBlock) {
        console.log("invalid recipe")
        return null
    }
    // console.log(recipeBlock)
    return convertJSONLDToRecipe(url, recipeBlock)
}

async function getRecipeJSONLD(html: Document): Promise<any> {
    const jsonLDBlocks = getJSONLDBlocks(html)
    // check length and error

    // @ts-ignore: this works :P
    const nodeDocumentLoader = jsonld.documentLoaders.node({
        strictSSL: true, maxRedirects: 10, headers: {}
    });
    // or grab the XHR one: jsonld.documentLoaders.xhr()

    // change the default document loader
    const customLoader = async (url: string, options: any) => {
        // call the default documentLoader
        return nodeDocumentLoader(url);
    };

    // @ts-ignore: this works :P
    jsonld.documentLoader = customLoader;

    for (let block of jsonLDBlocks) {
        const jsonData = JSON.parse(block.innerHTML)

        // compact a document according to a particular context
        // @ts-ignore: this works :P
        const compacted = await jsonld.compact(jsonData, recipeContext, { documentLoader: customLoader }) as any;

        const recipeBlock = getRecipeBlock(compacted)
        if (recipeBlock && Object.keys(recipeBlock).length > 0) {
            return recipeBlock
        }
    }

    const mdata = microdata("http://schema.org/Recipe", html) as any
    // const recipe = microdata("http://schema.org/Recipe", html) as RecipeSchema
    // if (typeof recipe === 'string') return null
    // if (typeof recipe === 'string') throw new Error('Expected a Recipe object')

    mdata["@context"] = "http://schema.org"
    // @ts-ignore: this works :P
    const compacted = await jsonld.compact(mdata, recipeContext, { documentLoader: customLoader }) as any;

    const recipeBlock = getRecipeBlock(compacted)
    if (recipeBlock && Object.keys(recipeBlock).length > 0) {
        return recipeBlock
    }

    return null

    // return {
    //     url: "",
    //     name: recipe.name?.toString() || "",
    //     author: recipe.author?.toString() || "",
    //     category: recipe.recipeCategory?.toString() || "",
    //     keywords: [],
    //     cuisine: recipe.recipeCuisine?.toString() || "",
    //     image: recipe.image?.toString() || "",
    //     instructions: [recipe.recipeInstructions?.toString()|| ""],
    //     ingredients: [recipe.recipeIngredient?.toString() || ""],
    //     time: recipe.totalTime?.toString() || "",
    // }
}
function getJSONLDBlocks(html: Document) {
    return Array.from(html.getElementsByTagName("script")).
        filter(elm => elm.attributes.getNamedItem("type")?.value === "application/ld+json")
}

function getRecipeBlock(jsonld: any): any {
    const recipeType = "http://schema.org/Recipe"
    if (jsonld["@type"] === recipeType) {
        return jsonld
    }

    if ("@graph" in jsonld) {
        const recipeElements = jsonld["@graph"].filter((x: any) => x["@type"] === recipeType)
        if (recipeElements.length) {
            return recipeElements[0]
        }
    }

    return {}
}

function convertJSONLDToRecipe(url: string, jsonld: any): Recipe {
    const keywords = getString(jsonld["keywords"])

    return {
        name: getString(jsonld["name"]),
        author: getString(jsonld["author"]["name"]),
        image: getString(jsonld["image"]),
        instructions: getStringList(jsonld["instructions"]),
        keywords: keywords === "" ? [] : keywords.split(",").map((x: string) => x.trim()),
        category: getString(jsonld["category"]).split(",")[0].trim(),
        ingredients: getStringList(jsonld["ingredients"]),
        // ingredients: jsonld["ingredients"],
        // sometimes it has a comma for multiple which notion does not like
        cuisine: getString(jsonld["cuisine"]).split(",")[0].trim(),
        time: getString(jsonld["time"]),
        url: url,
        description: getString(jsonld["description"]),
    }
}

function getString(item: any): string {
    // if (!(key in jsonld)) {
    //     return ""
    // }

    // const item: any = jsonld[key]

    const t = typeof item
    if (t === "string") {
        return item.trim()
    }

    if (t === "object" && item.constructor === Array) {
        if (item.length === 0) {
            return ""
        }

        return getString(item[0])
    }

    if (t === "object") {
        return getStringFromObj(item)
    }


    return ""
}

function getStringFromObj(jsonld: any): string {
    const t = jsonld["@type"]
    if (!t) {
        return jsonld["@id"];
    }

    if (t === "http://schema.org/ImageObject") {
        return getString(jsonld["url"])
    }

    if (t === "http://schema.org/HowToStep") {
        return getString(jsonld["http://schema.org/text"])
    }

    return ""
}

function getStringList(item: any): string[] {
    // if (!(key in jsonld)) {
    //     return []
    // }

    // const item: any = jsonld[key]

    const t = typeof item

    if (t === "string") {
        return [item.trim()]
    }

    if (t === "object" && item.constructor === Array) {
        const items = item.map((x: any) => getStringList(x))
        return ([] as string[]).concat(...items)
    }

    if (t === "object") {
        return getStringListFromObj(item)
    }


    return []
}



function getStringListFromObj(jsonld: any): string[] {
    const t = jsonld["@type"]
    if (!t) {
        return [];
    }

    if (t === "http://schema.org/HowToSection") {
        return getStringList(jsonld["http://schema.org/itemListElement"])
    }


    return [getStringFromObj(jsonld)]
}