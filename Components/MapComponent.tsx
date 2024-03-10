"use client"
import React from 'react';
import useMap from '../hooks/useMap';
import Popup from './Popup';
import { MapBrowserEvent } from 'ol';

const MapComponent: React.FC = () => {
  const { mapRef, popupRef, addMarker } = useMap();
  
 const handleAddMarker = (event: MapBrowserEvent<MouseEvent>) => {
    const coordinates = event.coordinate;
    addMarker(coordinates, '');
 };

handleAddMarker;
 return (
    <div>
      <div ref={mapRef} style={{ width: '100%', height: '400px' }}></div>
      <Popup ref={popupRef} />
      <div className='flex-1 justify-between '>

      {/* <button onClick={()=>toggleMarker}>Add Marker</button> */}
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
          <button  type="button"  id="undo">Undo</button>
        </span>
      </div>
      </div>

    </div>
    </div>
 );
};

export default MapComponent;
