import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { showDataMap } from './util';
import "./Map.css";

function Map({countries, casesType}) {
  return (
    <div className='map'>
      <MapContainer 
        center={[20.5937, 78.9629]} 
        zoom={4} 
        style={{ height: '65vh', width: '100%' }}
      >
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {/*Loop through each country and draw circles on the screen */}
        {showDataMap(countries, casesType)}
      </MapContainer>
    </div>
  );
}

export default Map;
