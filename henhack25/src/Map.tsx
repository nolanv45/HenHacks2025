import React, { useEffect, useRef, useState, JSX } from "react";
import "@arcgis/core/assets/esri/themes/light/main.css";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Graphic from "@arcgis/core/Graphic";
import PopupTemplate from "@arcgis/core/PopupTemplate";
import { GoogleGenerativeAI } from "@google/generative-ai";import { Button } from "react-bootstrap";
; // Replace with the actual library name


interface MapPageProps {
    goToHomePage: () => void;
  }

export const MapComponent = ({ goToHomePage }: MapPageProps): JSX.Element => {
  const mapDiv = useRef<HTMLDivElement>(null);
  type page = 'home' | 'Ai Page' | 'Recipe Page' | 'Map Page';


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


async function handleSubmit() {
    try {
      const apiKey = "AIzaSyDR-VHD19VDVq_t8ORrz4SCctc5Z_Rc6uQ";
      if (!apiKey) {
        console.error("API key not found in environment variables.");
        return;
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const prompt = `Generate a recipe from the medieval period of each region [Wales, Venetian Areas, Sweden, Sultanate of Iconium, Serbs, Principality of Russia, Principality of Pomerania, Principality of Antioch, Pomerania, Papal States, Norway, Latvians, Kingdom of Sicily, Kingdom of Scotland, Kingdom of Portugal, Kingdom of Poland, Kingdom of Navarre, Kingdom of Leon, Kingdom of Jerusalem, Kingdom of Italy, Kingdom of Hungary, Kingdom of Granada, Kingdom of Georgia, Kingdom of France, Kingdom of England, Kingdom of Cyprus, Kingdom of Castille, Kingdom of Burgundy, Kingdom of Bohemia, Khanate of the Golden Horde, Khanate of the Golden Hor, Ireland, German Empire, Duchy of Edessa, Denmark, Crown of Aragon, Byzantine Empire, Bulgaria, Ayyubid Dynasty, Almohad Dynasty] using the following ingredients:.
    Format the response as an individual valid JSON with the following keys:
    {
      "Region": "Region name",
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

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text(); // Await the text response

    // Ensure the response text is valid JSON
    const jsonStartIndex = text.indexOf('{');
    const jsonEndIndex = text.lastIndexOf('}') + 1;
    const jsonString = text.substring(jsonStartIndex, jsonEndIndex);

    const recipeData = JSON.parse(jsonString);
  
    // Assuming you want to store multiple recipes
    const recipesArray: Recipe[] = [];
    recipesArray.push(recipeData);

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
        
              
            // Define a PopupTemplate (if it's not already defined)
            featureLayer.popupTemplate = new PopupTemplate({
              title: `{REGIONNAME}`, // Use the field of your feature layer
              content: "{Description}", // Content can be adjusted to show relevant fields
            });

            // Add click event to the view for interaction
            view.on("click", (event: any) => {
              view.hitTest(event).then((response: any) => {
                const graphic = response.results[0]?.graphic;
                if (graphic) {
                    const regionName = graphic.attributes.Name; // Assuming 'Name' is the field for the region's name
            const regionDescription = graphic.attributes.Description;
                  // Open the popup for the clicked feature

                  if (view.popup) {
                    view.popup.open({
                      title: regionName,
                      content: regionDescription,
                      location: event.mapPoint, // Show popup at clicked point
                    });
                  }
                }
              });
            });
            const fields = featureLayer.fields;
            console.log("Layer Fields: ", fields)
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
  }, []);




 
  return (
      <div>
        <h2 className="header">Explore the Recipes of Europe!</h2>
          <div ref={mapDiv} style={{ height: "100vh", width: "100%" }} />
          
          <Button onClick={goToHomePage} className="submitAns">
          Go Home
        </Button>
      </div>
  );
};

export default MapComponent;
