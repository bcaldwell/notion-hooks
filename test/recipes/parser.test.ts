import { expect } from "@oclif/test"
import { parseRecipeFromURL } from "../../src/recipes/parser"
import { Recipe } from "../../src/recipes/types"

describe("Recipe Parser", () => {
  describe("Parse NYT correctly", function () {
    it("return correct recipe", async function () {
      const recipe = await parseRecipeFromURL("https://cooking.nytimes.com/recipes/1022064-roasted-salmon-with-asparagus-lemon-and-brown-butte")
      const expectedRecipe: Recipe = {
        name: "Roasted Salmon With Asparagus, Lemon and Brown Butter",
        author: "Kay Chun",
        image: "https://static01.nyt.com/images/2021/04/18/dining/kc-roasted-salmon-with-asparagus/kc-roasted-salmon-with-asparagus-articleLarge.jpg",
        instructions: [
          {
            title: "",
            instructions: [
              "Heat oven to 450 degrees. Rub salmon all over with 1 tablespoon oil and season with salt and pepper. Arrange skin side-down on a rimmed baking sheet and roast until medium, 8 to 10 minutes.",
              "While the salmon roasts, prepare the asparagus: In a large skillet, heat the remaining 1 tablespoon oil over medium-high. Add asparagus, season with salt and pepper and cook, stirring occasionally, until crisp-tender, about 3 minutes. Transfer asparagus to a plate.",
              "Reduce heat to medium and add butter to skillet. Cook, stirring, until foam subsides and butter is deep golden brown, 2 to 3 minutes. (Be careful not to burn). Turn off heat and stir in lemon juice, capers, peas, parsley and cooked asparagus. Season with salt and pepper.",
              "Divide vegetables among plates. Top with salmon and spoon over any remaining pan sauce. Garnish with parsley and serve with lemon wedges.",
            ],
            isMain: true,
          },
        ],
        keywords: [
          "asparagus",
          "peas",
          "salmon",
          "spring",
        ],
        category: "seafood",
        ingredients: [
          "4 (6-ounce) skin-on salmon fillets",
          "2 tablespoons extra-virgin olive oil",
          "Kosher salt and pepper",
          "1 pound asparagus, tough stems trimmed, stalks sliced 1/4-inch-thick on a slight bias (leave tips whole)",
          "4 tablespoons unsalted butter",
          "1 tablespoon fresh lemon juice, plus wedges for serving",
          "2 tablespoons drained capers",
          "1/2 cup thawed frozen peas",
          "1/4 cup coarsely chopped parsley, plus more for garnish",
        ],
        cuisine: "american",
        time: "PT15M",
        url: "https://cooking.nytimes.com/recipes/1022064-roasted-salmon-with-asparagus-lemon-and-brown-butte",
        description: "Ready in just 15 minutes, this fast dinner combines silky salmon with a vibrant green medley of asparagus and peas. While the fish roasts, the vegetables and sauce come together in one pan on the stovetop. Thinly slicing the asparagus is the trick to maintaining a crisp texture that complements the tender salmon, while bright lemon juice and zingy capers balance the nutty brown butter sauce. Parsley is used here to finish, but dill or tarragon would also be lovely. Leftover vegetables make a fantastic omelet filling the next day.",
      }
      expect(recipe).to.deep.equal(expectedRecipe)
    })
  })
  describe("Parse HowToSection and HowToStep in same array correctly", function () {
    it("returns correct recipe", async function () {
      const recipe = await parseRecipeFromURL("https://addapinch.com/the-best-chocolate-cake-recipe-ever")
      const expectedRecipe: Recipe = {
        name: "The Best Chocolate Cake Recipe {Ever}",
        author: "Robyn Stone | Add a Pinch",
        image: "https://addapinch.com/wp-content/uploads/2020/04/chocolate-cake-DSC_1768.jpg",
        instructions: [
          {
            title: "",
            instructions: [
              "Preheat oven to 350º F. Prepare two 9-inch cake pans by spraying with baking spray or buttering and lightly flouring.",
            ],
            isMain: true,
          },
          {
            title: "For the chocolate cake:",
            instructions: [
              "Add flour, sugar, cocoa, baking powder, baking soda, salt and espresso powder to a large bowl or the bowl of a stand mixer. Whisk through to combine or, using your paddle attachment, stir through flour mixture until combined well.",
              "Add milk, vegetable oil, eggs, and vanilla to flour mixture and mix together on medium speed until well combined. Reduce speed and carefully add boiling water to the cake batter until well combined.",
              "Distribute cake batter evenly between the two prepared cake pans. Bake for 30-35 minutes, until a toothpick or cake tester inserted in the center of the chocolate cake comes out clean.",
              "Remove from the oven and allow to cool for about 10 minutes, remove from the pan and cool completely.",
              "Frost cake with Chocolate Buttercream Frosting.",
            ],
            isMain: false,
          },
        ],
        keywords: [
          "best chocolate cake",
          "chocolate cake",
          "chocolate cake recipe",
          "classic chocolate cake",
          "dairy free chocolate cake",
          "easy chocolate cake",
          "egg free chocolate cake",
          "gluten-free chocolate cake",
        ],
        category: "Dessert",
        ingredients: [
          "2 cups all-purpose flour",
          "2 cups sugar",
          "3/4 cup unsweetened cocoa powder",
          "2 teaspoons baking powder",
          "1 1/2 teaspoons baking soda",
          "1 teaspoon salt",
          "1 teaspoon espresso powder (homemade or store-bought)",
          "1 cup milk (or buttermilk, almond, or coconut milk)",
          "1/2 cup vegetable oil (or canola oil, or melted coconut oil)",
          "2 large eggs",
          "2 teaspoons vanilla extract",
          "1 cup boiling water",
          "Chocolate Buttercream Frosting Recipe",
        ],
        cuisine: "American",
        time: "PT45M",
        url: "https://addapinch.com/the-best-chocolate-cake-recipe-ever",
        description: "The Best Chocolate Cake Recipe - A one bowl chocolate cake recipe that is quick, easy, and delicious! Updated with gluten-free, dairy-free, and egg-free options!",
      }
      expect(recipe).to.deep.equal(expectedRecipe)
    })
  })
  describe("Parse HowToSections array correctly", function () {
    it("returns correct recipe", async function () {
      const recipe = await parseRecipeFromURL("https://ohsweetbasil.com/moist-chocolate-zucchini-cake-recipe")
      const expectedRecipe: Recipe = {
        name: "Chocolate Zucchini Cake",
        author: "Sweet Basil",
        image: "https://ohsweetbasil.com/wp-content/uploads/chocolate-zucchini-cake-with-chocolate-cream-cheese-frosting-recipe-8.jpg",
        instructions: [
          {
            title: "For The Cake",
            instructions: [
              "Beat eggs until smooth and lemon in color",
              "Add the oil sugars, and vanilla.",
              "Blend well.",
              "In a separate bowl, mix flour, baking powder, baking soda, cocoa, cinnamon and salt.",
              "Mix dry ingredients and zucchini into the wet ingredients.",
              "Pour into a 9X13 inch cake pan and bake at 350 degrees for 30-40 minutes. Insert a toothpick at 30 minutes, if it comes out clean it is done.",
              "Allow the cake to cool completely which can take a good 1-3 hours depending on how warm your house is.  Then frost the cake and serve.",
              "Cover leftovers and store for up to 1 week.",
            ],
            isMain: false,
          },
          {
            title: "For the Frosting",
            instructions: [
              "In the bowl of an electric mixer using paddle attachment (or using an electric hand mixer with a large bowl), beat together 8 oz cream cheese with butter on medium/high speed until creamy, scraping down the bowl as needed. Add vanilla.",
              "Sift in 3 cups powdered sugar with 1/2 cup cocoa powder to ensure there are no lumps then add 1/4 tsp salt. Mix on low speed adding the splash of milk as it comes together. Add an additional tablespoon of milk if needed.",
            ],
            isMain: false,
          },
        ],
        keywords: [],
        category: "500+ Best Dessert Recipes",
        ingredients: [
          "3  Eggs",
          "1 Cup Sugar",
          "1 Cup Brown Sugar",
          "1 Cup Canola (plus 3 tablespoons)",
          "1 teaspoon Vanilla",
          "2 Cups Flour",
          "1/4 teaspoon Baking Powder",
          "1 teaspoon Baking Soda",
          "1/2 Cup Cocoa",
          "1 teaspoon Cinnamon",
          "1 teaspoon Salt",
          "2 Cups Zucchini (grated, doesn&#039;t need to be peeled, about 2 zucchini)",
          "8 oz Cream Cheese (room temperature)",
          "1/4 Cup Butter (unsalted, softened)",
          "3 Cups Powdered Sugar",
          "1/2 Cup Cocoa (unsweetened)",
          "1/4 teaspoon Salt",
          "1 Teaspoon Vanilla",
          "1 tablespoon Milk (Chocolate milk is a game changer if you have it)",
        ],
        cuisine: "American",
        time: "",
        url: "https://ohsweetbasil.com/moist-chocolate-zucchini-cake-recipe",
        description: "",
      }
      expect(recipe).to.deep.equal(expectedRecipe)
    })
  })
})
