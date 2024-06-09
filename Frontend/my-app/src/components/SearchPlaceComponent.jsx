import React, { useRef, useEffect } from 'react';

const SearchPlaceComponent = ({ setDestination }) => {
  const searchBoxRef = useRef(null);

  useEffect(() => {
    if (!searchBoxRef.current) return;

    const initializeAutocomplete = () => {
      const autocomplete = new window.google.maps.places.Autocomplete(searchBoxRef.current);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          const location = {
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng()
          };
          setDestination(location);
        }
      });
    };

    if (window.google && window.google.maps && window.google.maps.places) {
      initializeAutocomplete();
    }
  }, [setDestination]);

  return (
    <input
      type="text"
      placeholder="Search for a place"
      ref={searchBoxRef}
    />
  );
};

export default SearchPlaceComponent;
