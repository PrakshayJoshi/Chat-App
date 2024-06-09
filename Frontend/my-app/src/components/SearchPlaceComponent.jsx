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
    } else {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDHwPZ-34X-zriMdx_Wz_RIYk43H4sAeGU&libraries=places`;
      script.async = true;
      script.onload = initializeAutocomplete;
      document.body.appendChild(script);
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
