import React, { useEffect } from "react";
import MapView from "@arcgis/core/views/MapView";
import Map from "@arcgis/core/Map";
import BasemapToggle from "@arcgis/core/widgets/BasemapToggle";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

const MappingApp = () => {
    useEffect(() => {
        console.log("Map is loading...");

        const myMap = new Map({
            basemap: "topo",
        });

        let view = new MapView({
            map: myMap,
            container: "MapApp",
        });

        let basemapToggle = new BasemapToggle({
            view: view,
            nextBasemap: "hybrid",
        });

        const layer = new FeatureLayer({
            url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/0",
            definitionExpression: "POP2000 > 1000000",
        });

        layer.renderer = {
            type: "simple",
            symbol: {
                type: "simple-marker",
                size: 10,
                color: "blue",
            },
        };

        layer.popupTemplate = {
            content: "{areaname} has {POP2000} people living there in this census tract",
        };

        view.center = [-97.324, 36.640];
        view.zoom = 5;
        view.ui.add(basemapToggle, "top-right");

        myMap.add(layer);
    }, []);

    return <div id="MapApp" style={{ height: "100vh" }}></div>;
};

export default MappingApp;
