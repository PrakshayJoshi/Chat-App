import React, { useState, useRef, useEffect } from 'react';
import '../styles/SearchPlaceComponent.css';

const SearchPlaceComponent = ({ setDestination }) => {
  const [autocomplete, setAutocomplete] = useState(null);
  const inputRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const polygonRef = useRef(null);

  useEffect(() => {
    if (!window.google || !window.google.maps) {
      console.error('Google Maps JavaScript API library must be loaded.');
      return;
    }

    const initializeAutocomplete = () => {
      const input = inputRef.current;
      const autocomplete = new window.google.maps.places.Autocomplete(input);
      autocomplete.setFields(['geometry', 'address_components']);
      autocomplete.addListener('place_changed', () => onPlaceChanged(autocomplete));
      setAutocomplete(autocomplete);
    };

    initializeAutocomplete();
  }, []);

  const onPlaceChanged = (autocomplete) => {
    const place = autocomplete.getPlace();

    if (!place.geometry) {
      console.error('Place contains no geometry');
      return;
    }

    const location = place.geometry.location;
    setDestination({
      latitude: location.lat(),
      longitude: location.lng(),
      viewport: {
        north: place.geometry.viewport.getNorthEast().lat(),
        east: place.geometry.viewport.getNorthEast().lng(),
        south: place.geometry.viewport.getSouthWest().lat(),
        west: place.geometry.viewport.getSouthWest().lng(),
      },
    });

    const map = new window.google.maps.Map(mapRef.current, {
      center: location,
      zoom: 15,
    });

    if (markerRef.current) {
      markerRef.current.setMap(null);
    }

    const marker = new window.google.maps.Marker({
      position: location,
      map: map,
    });
    markerRef.current = marker;

    if (polygonRef.current) {
      polygonRef.current.setMap(null);
    }

    const bounds = new window.google.maps.LatLngBounds(
      place.geometry.viewport.getSouthWest(),
      place.geometry.viewport.getNorthEast()
    );

    const polygonCoords = [
      { lat: bounds.getNorthEast().lat(), lng: bounds.getNorthEast().lng() },
      { lat: bounds.getNorthEast().lat(), lng: bounds.getSouthWest().lng() },
      { lat: bounds.getSouthWest().lat(), lng: bounds.getSouthWest().lng() },
      { lat: bounds.getSouthWest().lat(), lng: bounds.getNorthEast().lng() },
    ];

    const polygon = new window.google.maps.Polygon({
      paths: polygonCoords,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
    });

    polygon.setMap(map);
    polygonRef.current = polygon;
  };

  return (
    <div className="search-place-container">
      <input
        type="text"
        ref={inputRef}
        className="search-place-input"
        placeholder="Search for a place"
      />
      <div id="map" ref={mapRef} className="map-container"></div>
    </div>
  );
};

export default SearchPlaceComponent;
