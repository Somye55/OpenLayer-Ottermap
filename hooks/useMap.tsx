// Import necessary tools from OpenLayers and React
"use client" //use this to declare the component as client-side 
import Feature from "ol/Feature";
import Map from "ol/Map";
import Overlay from "ol/Overlay";
import View from "ol/View";
import ZoomSlider from 'ol/control/ZoomSlider.js';
import { click } from "ol/events/condition";
import { Point, Polygon } from "ol/geom";
import { Draw, Modify } from "ol/interaction";
import Select from "ol/interaction/Select";
import { Vector as VectorLayer } from "ol/layer";
import TileLayer from "ol/layer/Tile";
import 'ol/ol.css';
import { fromLonLat } from "ol/proj";
import { Vector as VectorSource } from "ol/source";
import OSM from "ol/source/OSM";
import { Style } from "ol/style";
import Icon from "ol/style/Icon";
import { useEffect, useRef, useState } from "react";
import Rotate from 'ol/control/Rotate.js';

// This hook sets up and manages the map
const useMap = () => {
   // These are references to HTML elements that will be used in the map
  const mapRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [drawingSource] = useState(new VectorSource());
   //create a layer to display the drawing features
  const [drawingLayer] = useState(new VectorLayer({ source: drawingSource }));
  const [popupContent, setPopupContent] = useState<string | null>(null);   // This state holds the content to be shown in the popup
  const popup = useRef<Overlay | null>(null);   // This is a reference to the popup overlay

 // This effect runs once when the component mounts
  useEffect(() => {
    //check if the map and popup elements are available
    if (!mapRef.current || !popupRef.current) return;
    const raster = new TileLayer({
      source: new OSM(),
    });
    const source = new VectorSource({ wrapX: true });
    const vector = new VectorLayer({
      source: source,
    });
    const map = new Map({
      target: mapRef.current,
      layers: [raster, vector, drawingLayer],
      view: new View({
        center: fromLonLat([0, 0]),
        zoom: 2,
      })
    });
    //add controls to the map
    map.addControl(new ZoomSlider());
    map.addControl(new Rotate());
    //set up the popup overlay
    popup.current = new Overlay({
      element: popupRef.current,
      positioning: "bottom-center",
      stopEvent: false,
      offset: [0, -10],
    });

    map.addOverlay(popup.current);
    //add interactions for drawing and modifying features
    const modify = new Modify({ source: drawingSource });
    map.addInteraction(modify);

    const typeSelect = document.getElementById("type") as HTMLSelectElement;
     //set up the drawing interaction based on user selection
    let draw: Draw | undefined;
    function addInteraction() {
      const value = typeSelect?.value;
      if (value !== "None") {
        draw = new Draw({
          source: source,
          type: typeSelect?.value as import("ol/geom/Geometry").Type,
        });
        map.addInteraction(draw);
      }
    }
    typeSelect.onchange = function () {
      if (draw) {
        map.removeInteraction(draw);
      }
      addInteraction();
    };
    const undoButton = document.getElementById("undo");
    if (undoButton) {
      undoButton.addEventListener("click", function () {
        if (draw) {
          draw.removeLastPoint();
        }
      });
    }
    addInteraction();
    //handle clicks on the map to add markers or show coordinates in a popup
    map.on("click", (event) => {
      const clickedCoordinates = event.coordinate;
      addMarker(clickedCoordinates, "");
      const feature = map.forEachFeatureAtPixel(event.pixel, (feat) => feat);
      if (feature) {
        const coordinates = event.coordinate;
        popup.current?.setPosition(coordinates);
        if (popupRef.current) {
          popupRef.current.innerHTML = `<p>Coordinates: </br>
            <p> ${coordinates} </p>`;
        }
      } else {
        popup.current?.setPosition(undefined);
        if (popupRef.current) {
          popupRef.current.innerHTML = "";
        }
      }
    });
    const select = new Select({
      layers: [drawingLayer],
      condition: click,
    });
    map.addInteraction(select);

    // Select event for calculating area (incomplete as of now)
    select.on("select", (event) => {
      const selectedFeatures = event.selected;
      if (selectedFeatures.length > 0) {
        const feature = selectedFeatures[0];
        const geometry = feature.getGeometry();
        console.log(geometry?.getType());
        if (geometry instanceof Polygon) {
          const area = geometry.getArea();
          popup.current?.setPosition(
            geometry.getInteriorPoint().getCoordinates()
          );
          popupRef.current!.innerHTML = `<p>Area: ${area.toFixed(
            2
          )} sq. units</p>`;
        } else {
          console.log("Selected feature is not a polygon.");
        }
      }
    });
    //clean up when the component unmounts
    return () => {
      map.dispose();
    };
  }, []); // This effect runs once on mount

// This function adds a marker to the map at the given coordinates
  const addMarker = (coordinates: number[], data: string) => {
    const iconFeature = new Feature({
      geometry: new Point(coordinates),
      source: drawingSource,
    });

    const iconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 46],
        anchorXUnits: "fraction",
        anchorYUnits: "pixels",
        src: "https://openlayers.org/en/latest/examples/data/icon.png",
      }),
    });

    iconFeature.setStyle(iconStyle);
    drawingSource.addFeature(iconFeature);
  };

  //return the necessary tools and references for the map component
  return {
    mapRef,
    popupRef,
    addMarker,
  };
};
//export the useMap hook so it can be used in other components
export default useMap;
