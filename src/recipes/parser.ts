import got from "got"
// import { parse, HTMLElement } from 'node-html-parser';
import jsonld from "jsonld"

import { Instructions, Recipe } from "./types"
import { JSDOM } from "jsdom"
import { Recipe as RecipeSchema, Graph, HowToStep, HowToSection } from "schema-dts"
import { microdata } from "@cucumber/microdata"

const schemaDotOrgURL = "http://schema.org"
const schemaDotOrgContext = {
  "@context": schemaDotOrgURL,
}

export async function parseRecipeFromURL(url: string): Promise<Recipe | null> {
  const siteHTML = await got.get(url).text()
  // const parsedHTML = parse(siteHTML)
  const dom = new JSDOM(siteHTML)

  // check error...
  const recipeBlock = await getRecipeJSONLD(dom.window.document)
  if (!recipeBlock) {
    console.log("invalid recipe")
    return null
  }

  return convertJSONLDToRecipe(url, recipeBlock)
}

async function getRecipeJSONLD(html: Document): Promise<RecipeSchema | null> {
  const jsonLDBlocks = getJSONLDBlocks(html)
  // check length and error

  for (const block of jsonLDBlocks) {
    const jsonData = JSON.parse(block.innerHTML)

    // eslint-disable-next-line no-await-in-loop
    const compacted = await jsonld.compact(jsonData, schemaDotOrgContext, {
      // always return it as a graph
      graph: true,
      base: schemaDotOrgURL,
    })

    const recipe = getRecipeFromGraph(compacted as Graph)
    if (recipe === null) {
      continue
    }

    return recipe
  }

  const mdata = microdata("http://schema.org/Recipe", html) as any
  const compacted = await jsonld.compact(mdata, schemaDotOrgContext, {
    // always return it as a graph
    graph: true,
    base: schemaDotOrgURL,
  })

  return getRecipeFromGraph(compacted as Graph)
}

function getJSONLDBlocks(html: Document) {
  return [...html.querySelectorAll("script")].filter(elm => elm.attributes.getNamedItem("type")?.value === "application/ld+json")
}

function getRecipeFromGraph(graph: Graph): (RecipeSchema | null) {
  for (const el of graph["@graph"]) {
    if (isRecipe(el)) {
      return el
    }
  }

  return null
}

function isRecipe(el: any): el is RecipeSchema {
  const t = el["@type"] || el.type
  return t === "Recipe"
}

function convertJSONLDToRecipe(url: string, jsonld: RecipeSchema): Recipe {
  const keywords = getString(jsonld.keywords)

  return {
    name: getString(jsonld.name),
    author: getAuthor(jsonld.author?.valueOf()),
    image: getString(jsonld.image),
    instructions: getInstructions(jsonld.recipeInstructions),
    keywords: keywords === "" ? [] : keywords.split(",").map((x: string) => x.trim()),
    category: getString(jsonld.recipeCategory).split(",")[0].trim(),
    ingredients: getStringList(jsonld.recipeIngredient),
    // sometimes it has a comma for multiple which notion does not like
    cuisine: getString(jsonld.recipeCuisine).split(",")[0].trim(),
    time: getString(jsonld.totalTime),
    url: url,
    description: getString(jsonld.description),
  }
}

function getAuthor(author: any): string {
  if (!author) {
    return ""
  }

  if (typeof author === "string") {
    return author
  }

  // probably should make this smarter
  return (author as any).name
}

function getInstructions(instructions: any): Instructions[] {
  const t = typeof instructions
  const isArray = (t === "object" && instructions.constructor === Array)

  if (!isArray) {
    return []
  }

  if (instructions.length === 0) {
    return []
  }

  let result: Instructions[] = []
  const defaultInstructions: Instructions = {
    title: "",
    isMain: true,
    instructions: [],
  }

  for (const step of instructions) {
    if (isHowToStep(step)) {
      defaultInstructions.instructions.push(getString(step))
    }

    if (isHowToStepSection(step)) {
      result.push(getInstructionFromHowToSection(step))
    }
  }

  if (defaultInstructions.instructions.length > 0) {
    result = [defaultInstructions, ...result]
  }

  return result
}

function getStepsFromHowToSteps(steps: any): string[] {
  if (isArray<any>(steps)) {
    return steps.map(step => getString(step))
  }

  return []
}

function getInstructionFromHowToSection(section: HowToSection): Instructions {
  return {
    title: getString(section.name || section.text),
    instructions: getStepsFromHowToSteps(section.itemListElement || []),
    isMain: false,
  }
}

function isHowToStep(el: any): el is HowToStep {
  const t = el["@type"] || el.type
  return t === "HowToStep"
}

function isHowToStepSection(el: any): el is HowToSection {
  const t = el["@type"] || el.type
  return t === "HowToSection"
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
  const t = jsonld["@type"] || jsonld.type
  if (!t) {
    return jsonld["@id"]
  }

  if (t === "ImageObject") {
    return getString(jsonld.url)
  }

  if (t === "HowToStep") {
    return getString(jsonld.text)
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
    // eslint-disable-next-line unicorn/prefer-spread
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
    return []
  }

  return [getStringFromObj(jsonld)]
}

function isArray<T>(t: any): t is Array<T> {
  return (typeof t === "object" && t.constructor === Array)
}
