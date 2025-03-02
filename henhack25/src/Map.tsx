import React, { useEffect, useRef, useState, JSX } from "react";
import "@arcgis/core/assets/esri/themes/light/main.css";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import PopupTemplate from "@arcgis/core/PopupTemplate";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Button } from "react-bootstrap";

interface MapPageProps {
  goToHomePage: () => void;
}

interface Recipe {
  Region: string;
  recipename: string;
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

export const MapComponent = ({ goToHomePage }: MapPageProps): JSX.Element => {
  const mapDiv = useRef<HTMLDivElement>(null);
  const [recipesArray, setRecipesArray] = useState<Recipe[]>(() => {
    const savedRecipes = localStorage.getItem("recipesArray");
    return savedRecipes ? JSON.parse(savedRecipes) : [];
  });

  async function handleSubmit() {
    console.log("Generating recipes...");
    try {
      const apiKey = "AIzaSyDR-VHD19VDVq_t8ORrz4SCctc5Z_Rc6uQ";
      if (!apiKey) {
        console.error("API key not found in environment variables.");
        return;
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const regionsGroup1 = [
        "Wales", "Venetian Areas", "Sweden", "Sultanate of Iconium", "Serbs",
        "Principality of Russia", "Principality of Pomerania", "Principality of Antioch",
        "Pomerania", "Papal States", "Norway", "Latvians", "Kingdom of Sicily",
        "Kingdom of Scotland", "Kingdom of Portugal", "Kingdom of Poland", "Kingdom of Navarre"
      ];

      const regionsGroup2 = [
        "Kingdom of Leon", "Kingdom of Jerusalem", "Kingdom of Italy", "Kingdom of Hungary",
        "Kingdom of Granada", "Kingdom of Georgia", "Kingdom of France", "Kingdom of England",
        "Kingdom of Cyprus", "Kingdom of Castille", "Kingdom of Burgundy", "Kingdom of Bohemia",
        "Khanate of the Golden Horde", "Khanate of the Golden Hor", "Ireland", "German Empire",
        "Duchy of Edessa", "Denmark", "Crown of Aragon", "Byzantine Empire", "Bulgaria",
        "Ayyubid Dynasty", "Almohad Dynasty"
      ];

      const prompt1 = `Generate a recipe from the medieval period of each region [${regionsGroup1.join(", ")}] using the following ingredients:.
      Format the response as an individual valid JSON with the following keys:
      {
        "Region": "Region name",
        "recipename": "Name of the recipe",
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
      Return only the JSON objects without extra formatting.`;

      const prompt2 = `Generate a recipe from the medieval period of each region [${regionsGroup2.join(", ")}] using the following ingredients:.
      Format the response as an individual valid JSON with the following keys:
      {
        "Region": "Region name",
        "recipename": "Name of the recipe",
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
      Return only the JSON objects without extra formatting.`;

      console.log("Prompt 1:", prompt1);
      console.log("Prompt 2:", prompt2);

      const result1 = await model.generateContent(prompt1);
      const response1 = await result1.response;
      const text1 = await response1.text(); // Await the text response

      console.log("Response text 1:", text1);

      const result2 = await model.generateContent(prompt2);
      const response2 = await result2.response;
      const text2 = await response2.text(); // Await the text response

      console.log("Response text 2:", text2);

      // Ensure the response text is valid JSON
      const jsonStartIndex1 = text1.indexOf('{');
      const jsonEndIndex1 = text1.lastIndexOf('}') + 1;
      const jsonString1 = text1.substring(jsonStartIndex1, jsonEndIndex1);

      const jsonStartIndex2 = text2.indexOf('{');
      const jsonEndIndex2 = text2.lastIndexOf('}') + 1;
      const jsonString2 = text2.substring(jsonStartIndex2, jsonEndIndex2);

      console.log("JSON string 1:", jsonString1);
      console.log("JSON string 2:", jsonString2);

      // Split the JSON string into individual JSON objects
      const recipesData1 = JSON.parse(`[${jsonString1.split('}{').join('},{')}]`);
      const recipesData2 = JSON.parse(`[${jsonString2.split('}{').join('},{')}]`);

      // Combine the results from both API calls
      const combinedRecipesData = [...recipesData1, ...recipesData2];

      // Assuming combinedRecipesData is an array of recipes
      setRecipesArray(combinedRecipesData);
      localStorage.setItem("recipesArray", JSON.stringify(combinedRecipesData));
      console.log("Recipes generated:", combinedRecipesData);
    } catch (error) {
      console.error("Error generating recipe:", error);
    }
  }

  useEffect(() => {
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

        // Loop through layers in the WebMap and find the FeatureLayer
        webmap.layers.forEach((layer: any) => {
          if (layer.type === "feature") {
            const featureLayer = layer as FeatureLayer;
            console.log("FeatureLayer found: ", featureLayer);

            // Query all features in the layer
            featureLayer.queryFeatures().then((results: any) => {
              results.features.forEach((feature: any) => {
                console.log("Feature attributes: ", feature.attributes);
              });
            });

            // Define a PopupTemplate (if it's not already defined)
            featureLayer.popupTemplate = new PopupTemplate({
              title: `{REGIONNAME}`, // Use the field of your feature layer
              content: (feature: any) => {
                const attributes = feature.graphic.attributes;
                console.log("Feature attributes:", attributes);
                const regionName = attributes.Name || attributes.REGIONNAME || attributes.regionName; // Check for different possible attribute names
                console.log(`Region name: ${regionName}`);
                const recipe = recipesArray.find(r => r.Region === regionName);
                if (recipe) {
                  console.log(`Recipe found for ${regionName}: ${recipe.Region}`);
                  return `
                    <h3>${recipe.Region}</h3>
                    <p><strong>Recipe:</strong> ${recipe.recipename}</p>
                    <p><strong>Time:</strong> ${recipe.time}</p>
                    <h4>Ingredients</h4>
                    <ul>
                      ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                    </ul>
                    <h4>Instructions</h4>
                    <ol>
                      ${recipe.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
                    </ol>
                    <h4>Macronutrients</h4>
                    <ul>
                      <li><strong>Calories:</strong> ${recipe.macronutrients.calories}</li>
                      <li><strong>Protein:</strong> ${recipe.macronutrients.protein}</li>
                      <li><strong>Carbs:</strong> ${recipe.macronutrients.carbs}</li>
                      <li><strong>Fat:</strong> ${recipe.macronutrients.fat}</li>
                    </ul>
                  `;
                } else {
                  console.log(`No recipe found for ${regionName}`);
                  return `<p>No recipe found for ${regionName}</p>`;
                }
              }
            });

            // Add click event to the view for interaction
            view.on("click", (event: any) => {
              view.hitTest(event).then((response: any) => {
                const graphic = response.results[0]?.graphic;
                if (graphic) {
                  const attributes = graphic.attributes;
                  console.log("Clicked feature attributes:", attributes);
                  const regionName = attributes.Name || attributes.REGIONNAME || attributes.regionName; // Check for different possible attribute names
                  console.log(`Clicked region: ${regionName}`);
                  const recipe = recipesArray.find(r => r.Region === regionName);
                  if (recipe) {
                    console.log(`Recipe found for ${regionName}: ${recipe.Region}`);
                    const content = `
                      <h3>${recipe.Region}</h3>
                      <p><strong>Time:</strong> ${recipe.time}</p>
                      <h4>Ingredients</h4>
                      <ul>
                        ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                      </ul>
                      <h4>Instructions</h4>
                      <ol>
                        ${recipe.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
                      </ol>
                      <h4>Macronutrients</h4>
                      <ul>
                        <li><strong>Calories:</strong> ${recipe.macronutrients.calories}</li>
                        <li><strong>Protein:</strong> ${recipe.macronutrients.protein}</li>
                        <li><strong>Carbs:</strong> ${recipe.macronutrients.carbs}</li>
                        <li><strong>Fat:</strong> ${recipe.macronutrients.fat}</li>
                      </ul>
                    `;
                    if (view.popup) {
                      view.popup.open({
                        title: regionName,
                        content: content,
                        location: event.mapPoint, // Show popup at clicked point
                      });
                    }
                  } else {
                    console.log(`No recipe found for ${regionName}`);
                    if (view.popup) {
                      view.popup.open({
                        title: regionName,
                        content: `<p>No recipe found for ${regionName}</p>`,
                        location: event.mapPoint, // Show popup at clicked point
                      });
                    }
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
  }, [recipesArray]);

  return (
    <div>
      <h2 className="header">Explore the Recipes of Europe!</h2>
      <Button onClick={handleSubmit} className="submitAns">
        Generate Recipes
      </Button>
      <Button onClick={goToHomePage} className="submitAns">
        Go Home
      </Button>
      <div ref={mapDiv} style={{ height: "100vh", width: "100%" }} />
    </div>
  );
};

export default MapComponent;