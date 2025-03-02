import React, { useEffect, useRef, useState } from "react";
import "@arcgis/core/assets/esri/themes/light/main.css";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Graphic from "@arcgis/core/Graphic";
import PopupTemplate from "@arcgis/core/PopupTemplate";



export const MapComponent = () => {
  const mapDiv = useRef<HTMLDivElement>(null);

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
              title: "{Name}", // Use the field of your feature layer
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
  type page = 'home' | 'Ai Page' | 'Recipe Page' | 'Map Page';
  const [currentPage, setCurrentPage] = useState<page>('home');

function goBack() {
    setCurrentPage('home');
  }
 
  return (
      <div>
        <h2 className="header">Explore the Recipes of Europe!</h2>
          <div ref={mapDiv} style={{ height: "100vh", width: "100%" }} />
          <button onClick={goBack} className="mapButton">Go Back</button>
      </div>
  );
};

export default MapComponent;

function setCurrentPage(arg0: string) {
  throw new Error("Function not implemented.");
}
