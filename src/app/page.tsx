// pages/index.tsx
import React from 'react';
import MapComponent from '../../Components/MapComponent';

const HomePage: React.FC = () => {
 return (
    <div>
      {/* map component to render map and its components */}
      <MapComponent /> 
    </div>
 );
};

export default HomePage;
