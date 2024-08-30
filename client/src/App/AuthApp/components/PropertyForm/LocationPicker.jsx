import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";

export const customIcon = new L.Icon({
  iconUrl: markerIconUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: markerShadowUrl,
  shadowSize: [41, 41],
});

const LocationPicker = ({ setLocation, initialLocation }) => {
  const [position, setPosition] = useState([32.0853, 34.7818]);

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        setLocation({
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        });
      },
    });

    return position === null ? null : (
      <Marker position={position} icon={customIcon}></Marker>
    );
  };

  useEffect(() => {
    if (initialLocation.latitude && initialLocation.longitude) {
      setPosition([initialLocation.latitude, initialLocation.longitude]);
      setLocation({
        latitude: initialLocation.latitude,
        longitude: initialLocation.longitude,
      });
    }
  }, [initialLocation, setLocation]);

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationMarker />
    </MapContainer>
  );
};

export default LocationPicker;
