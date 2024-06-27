// Create a new file utils/locationUtils.js
const isLocationWithinBoundary = (location, boundary) => {
    const { latitude, longitude } = location;
    const { northeast, southwest } = boundary;
  
    return (
      latitude <= northeast.lat &&
      latitude >= southwest.lat &&
      longitude <= northeast.lng &&
      longitude >= southwest.lng
    );
  };
  
  module.exports = {
    isLocationWithinBoundary
  };
  