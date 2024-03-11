// Import necessary libraries and components
"use client" // we use this to declare the component as client-side 
import React from 'react';
import useMap from '../hooks/useMap';
import Popup from './Popup';
import { MapBrowserEvent } from 'ol';

const MapComponent: React.FC = () => {
  // Use the useMap hook to get necessary functions and references
  const { mapRef, popupRef, addMarker } = useMap();

 const handleAddMarker = (event: MapBrowserEvent<MouseEvent>) => {
    // Get the coordinates from the event
    const coordinates = event.coordinate;
    addMarker(coordinates, '');
 };
  // Define a function to add a marker on the map
  handleAddMarker;
 return (
    <div>
      {/* Map container */}
      <div ref={mapRef} id='map' className='map'></div>
      {/* Popup component */}
      <Popup ref={popupRef} />
      {/* Controls for selecting geometry type and undoing actions */}
      <div className="row">
        <div className="col-auto">
          <span className="input-group">
            <label className="input-group-text" htmlFor="type">Geometry type:</label>
            <select className="form-select" id="type">
              <option value="Point">Point</option>
              <option value="LineString">LineString</option>
              <option value="Polygon">Polygon</option>
              <option value="Circle">Circle</option>
              <option value="None">None</option>
            </select>
            <button type="button" value="Undo" id="undo">Undo</button>
          </span>
        </div>
      </div>
    </div>
 );
};

export default MapComponent;
