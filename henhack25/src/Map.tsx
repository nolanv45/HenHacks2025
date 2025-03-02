import React, { useEffect, useRef, useState } from "react";
import "@arcgis/core/assets/esri/themes/light/main.css";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Graphic from "@arcgis/core/Graphic";
import PopupTemplate from "@arcgis/core/PopupTemplate";

// Import or define GoogleGenerativeAI
class GoogleGenerativeAI {
  apiKey: string;
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  getGenerativeModel({ model }: { model: string }) {
    return {
      generateContent: async (prompt: string) => {
        // Mocking the response for demonstration purposes
        return {
          response: {
            text: async () => `{
              "time": "30 minutes",
              "ingredients": ["1 cup of flour", "2 eggs"],
              "instructions": ["Mix ingredients", "Bake at 350F for 20 minutes"],
              "macronutrients": {
                "calories": "200",
                "protein": "10g",
                "carbs": "30g",
                "fat": "5g"
              }
            }`
          }
        };
      }
    };
  }
}

export const MapComponent = () => {
  const mapDiv = useRef<HTMLDivElement>(null);
  const [ingredientsList, setIngredientsList] = useState<{ [key: string]: string[] }>({});

  const [ingredients, setIngredients] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [recipeGenerated, setRecipeGenerated] = useState<boolean>(false);
  type page = 'home' | 'Ai Page' | 'Recipe Page' | 'Map Page';

  const [currentPage, setCurrentPage] = useState<page>('home');

  interface Recipe {
    time: string;
    ingredients: string[];
    instructions: string[];
    macronutrients: {
      calories: string;
      protein: string;
      carbs: string;
      fat: string;
    };
  }
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    async function handleSubmit() {
      try {
        const apiKey = "AIzaSyDR-VHD19VDVq_t8ORrz4SCctc5Z_Rc6uQ";
        if (!apiKey) {
          console.error("API key not found in environment variables.");
          return;
        }

        const genAI = {
          apiKey: "AIzaSyDR-VHD19VDVq_t8ORrz4SCctc5Z_Rc6uQ",
          getGenerativeModel: ({ model }: { model: string }) => ({
            generateContent: async (prompt: string) => {
              // Mocking the response for demonstration purposes
              return {
                response: {
                  text: async () => `{
                    "time": "30 minutes",
                    "ingredients": ["1 cup of flour", "2 eggs"],
                    "instructions": ["Mix ingredients", "Bake at 350F for 20 minutes"],
                    "macronutrients": {
                      "calories": "200",
                      "protein": "10g",
                      "carbs": "30g",
                      "fat": "5g"
                    }
                  }`
                }
              };
            }
          })
        };
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = `Generate a recipe from ${country} using the following ingredients: ${ingredients}.
        Format the response as valid JSON with the following keys:
        {
          "time": "Estimated preparation and cooking time",
          "ingredients": ["List of ingredients with quantities"],
          "instructions": ["Step 1", "Step 2", "Step 3", ...],
          "macronutrients": {
            "calories": "value",
            "protein": "value",
            "carbs": "value",
            "fat": "value"
          }
        }
        Return only the JSON object without extra formatting.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text(); // Await the text response

        // Ensure the response text is valid JSON
        const jsonStartIndex = text.indexOf('{');
        const jsonEndIndex = text.lastIndexOf('}') + 1;
        const jsonString = text.substring(jsonStartIndex, jsonEndIndex);

        const recipeData = JSON.parse(jsonString);

        setRecipe(recipeData); // Use the state setter
        setRecipeGenerated(true);
      } catch (error) {
        console.error("Error generating recipe:", error);
      }
    }
    if (mapDiv.current) {
      const webmap = new WebMap({
        portalItem: { id: "047cb3b3562f4760a2f5c3b05d83d4fd" }
      });

      const view = new MapView({
        map: webmap,
        container: mapDiv.current,
        center: [10, 50],
        zoom: 4,
      });

      view.when(() => {
        console.log("Map and View are ready");

        webmap.layers.forEach((layer: any) => {
          if (layer.type === "feature") {
            const featureLayer = layer as FeatureLayer;

            featureLayer.load().then(() => {
              console.log("Fields in Boundaries Layer:", featureLayer.fields.map((f: any) => f.name));

              // Extract ingredients for each region
              featureLayer.queryFeatures().then((results: any) => {
                const ingredients: { [key: string]: string[] } = {};
                results.features.forEach((feature: any) => {
                  const regionName = feature.attributes.Name;
                  const regionIngredients = feature.attributes.Ingredients.split(","); // Assuming 'Ingredients' is a field
                  ingredients[regionName] = regionIngredients;
                });
                setIngredientsList(ingredients);
              });
            });

            featureLayer.popupTemplate = new PopupTemplate({
              title: `{Name}`, // Use the field of your feature layer
              content: (feature: any) => {
                const regionName = feature.graphic.attributes.Name;
                const regionIngredients = ingredientsList[regionName] || [];
                return `
                  <p><strong>Ingredients:</strong></p>
                  <ul>
                    ${regionIngredients.map((ingredient: string) => `<li>${ingredient}</li>`).join('')}
                  </ul>
                `;
              }
            });

            view.on("click", (event: any) => {
              view.hitTest(event).then((response: any) => {
                const graphic = response.results[0]?.graphic;
                if (graphic) {
                  const regionName = graphic.attributes.Name;
                  const regionDescription = graphic.attributes.Description;
                  const regionIngredients = ingredientsList[regionName] || [];

                  if (view.popup) {
                    view.popup.open({
                      title: regionName,
                      content: `
                        <p>${regionDescription}</p>
                        <p><strong>Ingredients:</strong></p>
                        <ul>
                          ${regionIngredients.map((ingredient: string) => `<li>${ingredient}</li>`).join('')}
                        </ul>
                      `,
                      location: event.mapPoint,
                    });
                  }
                }
              });
            });
          }
        });
      }, (error: any) => {
        console.error("Error loading WebMap: ", error);
      });

      return () => {
        if (mapDiv.current) {
          mapDiv.current.innerHTML = "";
        }
      };
    }
  }, [ingredientsList]);

  function goBack() {
    setCurrentPage('home');
  }

  return (
    <div>
      <h2 className="header">Explore the Recipes of Europe!</h2>
      <div ref={mapDiv} style={{ height: "100vh", width: "100%" }} />
      <button onClick={goBack}>Go Back</button>
    </div>
  );
};

export default MapComponent;

function setCurrentPage(arg0: string) {
  throw new Error("Function not implemented.");
}
