import React, { useEffect, useRef } from "react";
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
              title: layer.title, // Use the field of your feature layer
              content: layer.content, // Content can be adjusted to show relevant fields
            });

            // Add click event to the view for interaction
            view.on("click", (event: any) => {
              view.hitTest(event).then((response: any) => {
                const graphic = response.results[0]?.graphic;
                if (graphic) {
                  // Open the popup for the clicked feature
                  if (view.popup) {
                    view.popup.open({
                      title: graphic.attributes.Name,
                      content: graphic.attributes.Description,
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
        <h2 className="header">Get a European Recipe!</h2>
     
          <div ref={mapDiv} style={{ height: "100vh", width: "100%" }} />
      </div>
    
  );
};

export default MapComponent;