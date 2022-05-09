import got from 'got';
import { parse, HTMLElement } from 'node-html-parser';
import jsonld from 'jsonld';

async function main() {
        const siteHTML = await got.get('https://www.delish.com/cooking/recipe-ideas/a39585937/keto-buckeye-brownies/').text();
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
                  console.log(url)
                // call the default documentLoader
                return nodeDocumentLoader(url);
              };
              
              // @ts-ignore: this works :P
              jsonld.documentLoader = customLoader;
              
              // compact a document according to a particular context
              // @ts-ignore: this works :P
              const compacted = await jsonld.compact(jsonData, context, {documentLoader: customLoader});
              
              console.log(JSON.stringify(compacted, null, 2));
        }
            
        // console.log(jsonLDBlocks);
}

function getJSONLDBlocks(html: HTMLElement) {
    return html.getElementsByTagName("script").
                filter(elm => elm.attrs["type"] === "application/ld+json")
}

main()