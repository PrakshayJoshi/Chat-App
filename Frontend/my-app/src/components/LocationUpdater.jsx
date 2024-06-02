import { useEffect } from 'react';
import { useUser } from '../contexts/UserContext';

const LocationUpdater = () => {
  const { user } = useUser();

  useEffect(() => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.error('No user ID found');
      return;
    }

    const updateLocation = async (latitude, longitude) => {
      try {
        const response = await fetch(`http://localhost:9000/api/users/${userId}/location`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ latitude, longitude }),
        });

        if (response.ok) {
          console.log('Location updated');
        } else {
          console.error('Failed to update location');
        }
      } catch (error) {
        console.error('Error updating location:', error);
      }
    };

    const checkLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            updateLocation(latitude, longitude);
          },
          (error) => {
            console.error('Error getting location:', error);
          }
        );
      }
    };

    const intervalId = setInterval(checkLocation, 30000); // Check location every 30 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [user]);

  return null;
};

export default LocationUpdater;
