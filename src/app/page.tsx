// pages/index.tsx
import React from 'react';
import MapComponent from '../../Components/MapComponent';

const HomePage: React.FC = () => {
 return (
    <div>
      <h1>OpenLayers Map with Popup</h1>
      <MapComponent />
    </div>
 );
};

export default HomePage;
