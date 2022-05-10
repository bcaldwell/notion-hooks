import {Command, Flags} from '@oclif/core'
import got from 'got';
import { parse, HTMLElement } from 'node-html-parser';
import jsonld from 'jsonld';
import {Recipe} from '../notion/types'

export default class RecipeDbImport extends Command {
  static description = 'imports recipe from a website to a notion db'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    url: Flags.string({description: 'url path to recipe', required: true}),
  }

  // static args = [{name: 'file'}]

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(RecipeDbImport)

    const url = flags.url

    const siteHTML = await got.get(url).text();
    const parsedHTML = parse(siteHTML)

        const jsonLDBlocks = getJSONLDBlocks(parsedHTML)

        for (let block of jsonLDBlocks) {
            const jsonData = JSON.parse(block.textContent)
            const context = {
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
              
              // compact a document according to a particular context
              // @ts-ignore: this works :P
              const compacted = await jsonld.compact(jsonData, context, {documentLoader: customLoader}) as any;

              const recipeBlock = (compacted["@type"] === "http://schema.org/Recipe")? compacted : 
                compacted["@graph"].filter((x:any) => x["@type"] === "http://schema.org/Recipe")[0]
              
              const recipe:Recipe = {
                name: recipeBlock["name"],
                author: recipeBlock["author"]["name"],
                image: recipeBlock["image"][0],
                // image: recipeBlock["image"][0],
                instructions: recipeBlock["instructions"].map((x:any) => x["http://schema.org/text"]),
                keywords: recipeBlock["keywords"],
                category: recipeBlock["category"],
                ingredients: recipeBlock["ingredients"],
                cuisine: recipeBlock["cuisine"],
                time: recipeBlock["time"],
                url: recipeBlock["url"],
                // url: recipeBlock["url"]["@id"],
                description: recipeBlock["description"],
              }

              console.log(JSON.stringify(recipe, null, 2));
        }

        
  }
}

function getJSONLDBlocks(html: HTMLElement) {
  return html.getElementsByTagName("script").
              filter(elm => elm.attrs["type"] === "application/ld+json")
}