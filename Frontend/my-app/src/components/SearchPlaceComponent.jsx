import React, { useState, useRef, useEffect } from 'react';
import '../styles/SearchPlaceComponent.css';

const SearchPlaceComponent = ({ setDestination }) => {
  const [autocomplete, setAutocomplete] = useState(null);
  const inputRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const polygonRef = useRef(null);

  useEffect(() => {
    if (window.google && window.google.maps) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 37.7749, lng: -122.4194 },
        zoom: 10,
      });

      const options = {
        fields: ['address_components', 'geometry', 'icon', 'name'],
      };
      const autoCompleteInstance = new window.google.maps.places.Autocomplete(inputRef.current, options);
      autoCompleteInstance.bindTo('bounds', map);

      autoCompleteInstance.addListener('place_changed', () => {
        const place = autoCompleteInstance.getPlace();
        if (!place.geometry || !place.geometry.location) {
          console.log(`No details available for input: '${place.name}'`);
          return;
        }

        if (markerRef.current) {
          markerRef.current.setMap(null);
        }
        markerRef.current = new window.google.maps.Marker({
          map: map,
          position: place.geometry.location,
        });

        map.setCenter(place.geometry.location);
        map.setZoom(15);

        if (polygonRef.current) {
          polygonRef.current.setMap(null);
        }

        const bounds = place.geometry.viewport;
        const northeast = bounds.getNorthEast();
        const southwest = bounds.getSouthWest();

        const polygonPath = [
          { lat: northeast.lat(), lng: southwest.lng() },
          { lat: northeast.lat(), lng: northeast.lng() },
          { lat: southwest.lat(), lng: northeast.lng() },
          { lat: southwest.lat(), lng: southwest.lng() },
        ];

        polygonRef.current = new window.google.maps.Polygon({
          map: map,
          paths: polygonPath,
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
        });

        setDestination({
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
          boundary: {
            northeast: { lat: northeast.lat(), lng: northeast.lng() },
            southwest: { lat: southwest.lat(), lng: southwest.lng() },
          },
        });
      });

      setAutocomplete(autoCompleteInstance);
    }
  }, [setDestination]);

  return (
    <div className="search-place">
      <input ref={inputRef} type="text" placeholder="Search for a place" />
      <div ref={mapRef} className="map"></div>
    </div>
  );
};

export default SearchPlaceComponent;
