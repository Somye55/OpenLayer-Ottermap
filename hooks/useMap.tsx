// hooks/useMap.ts
import { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import Overlay from "ol/Overlay";
import { fromLonLat } from "ol/proj";
import { Draw, Modify } from "ol/interaction";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Polygon, Point, LineString } from "ol/geom";
import { Style, Fill, Stroke } from "ol/style";
import { click, pointerMove, Condition } from "ol/events/condition";
import { platformModifierKeyOnly } from "ol/events/condition";
import { unByKey } from "ol/Observable";
import Feature from "ol/Feature";
import Icon from "ol/style/Icon";

const useMap = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [drawingSource] = useState(new VectorSource());
  const [drawingLayer] = useState(new VectorLayer({ source: drawingSource }));
  const [popupContent, setPopupContent] = useState<string | null>(null);
  const popup = useRef<Overlay | null>(null);

  useEffect(() => {
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
      layers: [raster, vector,drawingLayer,
      ],
      view: new View({
        center: fromLonLat([0, 0]),
        zoom: 2,
      }),
    });

    popup.current = new Overlay({
      element: popupRef.current,
      positioning: "bottom-center",
      stopEvent: false,
      offset: [0, -10],
    });

    map.addOverlay(popup.current);

    const modify = new Modify({ source: drawingSource });
    map.addInteraction(modify);

    const typeSelect = document.getElementById("type") as HTMLSelectElement;
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

    map.on("click", (event) => {
      const clickedCoordinates = event.coordinate;
        addMarker(clickedCoordinates, '');
        const feature = map.forEachFeatureAtPixel(event.pixel, (feat) => feat);
        if (feature) {
          const coordinates = event.coordinate;
          popup.current?.setPosition(coordinates);
          if (popupRef.current) {
            popupRef.current.innerHTML = 
            `<p>Coordinates: </br>
            <p> ${coordinates} </p>`;
          }
        } else {
          popup.current?.setPosition(undefined);
          if (popupRef.current) {
            popupRef.current.innerHTML = "";
          }
      }
    });

    return () => {
      map.dispose();
    };
  }, []); // Add isDrawing to the dependency array to re-run the effect when it changes

  const addMarker = (coordinates: number[], data: string) => {
    const iconFeature = new Feature({
      geometry: new Point(coordinates),
      source: drawingSource
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


  return {
    mapRef,
    popupRef,
    addMarker
    
    
  };
};

export default useMap;
