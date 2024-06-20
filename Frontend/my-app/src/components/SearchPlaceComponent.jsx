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

  const onPlaceChanged = async (autocomplete) => {
    const place = autocomplete.getPlace();

    if (!place.geometry) {
      console.error('Place contains no geometry');
      return;
    }

    const location = place.geometry.location;
    const viewport = place.geometry.viewport;

    const boundary = {
      northeast: { lat: viewport.getNorthEast().lat(), lng: viewport.getNorthEast().lng() },
      southwest: { lat: viewport.getSouthWest().lat(), lng: viewport.getSouthWest().lng() }
    };

    setDestination({
      latitude: location.lat(),
      longitude: location.lng(),
      boundary
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

    const polygonCoords = [
      { lat: boundary.northeast.lat, lng: boundary.northeast.lng },
      { lat: boundary.northeast.lat, lng: boundary.southwest.lng },
      { lat: boundary.southwest.lat, lng: boundary.southwest.lng },
      { lat: boundary.southwest.lat, lng: boundary.northeast.lng },
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

    // Fetch nearby users
    await fetchNearbyUsers(location.lat(), location.lng(), boundary);
  };

  const fetchNearbyUsers = async (latitude, longitude, boundary) => {
    try {
      const queryParams = new URLSearchParams({
        latitude,
        longitude,
        northeast: JSON.stringify(boundary.northeast),
        southwest: JSON.stringify(boundary.southwest)
      });

      const response = await fetch(`http://localhost:9000/api/users/nearby?${queryParams.toString()}`);
      const data = await response.json();
      if (data.success) {
        console.log('Nearby users:', data.users);
      } else {
        console.error('Failed to fetch nearby users');
      }
    } catch (error) {
      console.error('Error fetching nearby users:', error);
    }
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
