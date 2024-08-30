import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import PropertyCard from "./PropertyCard";
import { customIcon } from "../PropertyForm/LocationPicker";

const PropertyMap = ({ properties }) => {
  return (
    <MapContainer
      center={[31.0461, 34.8516]}
      zoom={8}
      style={{ height: "600px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {properties.map((property) => (
        <Marker
          key={property._id}
          position={[property.latitude, property.longitude]}
          icon={customIcon}
        >
          <Popup>
            <PropertyCard property={property} />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default PropertyMap;
