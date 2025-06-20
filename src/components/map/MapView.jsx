import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Shield, MapPin, Navigation } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

// Fix for default marker icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

export default function MapView({ shelters, selectedShelter, onShelterSelect, isLoading }) {
  const [mapCenter, setMapCenter] = useState(
    selectedShelter
      ? [selectedShelter.latitude, selectedShelter.longitude]
      : shelters.length > 0
      ? [shelters[0].latitude, shelters[0].longitude]
      : [32.0853, 34.7818] // Default to Tel Aviv
  );
  const [isLocating, setIsLocating] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('הגיאולוקיישן לא נתמך בדפדפן שלך');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = [position.coords.latitude, position.coords.longitude];
        setMapCenter(newLocation);
        setUserLocation(newLocation);
        setIsLocating(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('לא ניתן היה לקבל את המיקום הנוכחي');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
          <p className="text-gray-500">טוען מפה...</p>
        </div>
      </div>
    );
  }

  if (shelters.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">לא נמצאו מקלטים להצגה</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <Button
        onClick={getCurrentLocation}
        disabled={isLocating}
        className="absolute top-4 left-4 z-[1000] bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-lg"
        size="sm"
      >
        <Navigation className="w-4 h-4 ml-2" />
        {isLocating ? 'מאתר...' : 'המיקום שלי'}
      </Button>

      <MapContainer
        center={mapCenter}
        zoom={selectedShelter ? 15 : 10}
        style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
        key={mapCenter.join(',')}
      >
        <TileLayer
          url="https://{s}.tile.openstreetMap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>
              <div className="font-sans">
                <h3 className="font-bold text-base mb-1 flex items-center gap-1">
                  <Navigation className="w-4 h-4 text-blue-600" />
                  המיקום שלי
                </h3>
              </div>
            </Popup>
          </Marker>
        )}

        {shelters.map(shelter => (
          <Marker
            key={shelter.id}
            position={[shelter.latitude, shelter.longitude]}
            eventHandlers={{
              click: () => {
                onShelterSelect(shelter);
              },
            }}
          >
            <Popup>
              <div className="font-sans">
                <h3 className="font-bold text-base mb-1 flex items-center gap-1">
                  <Shield className="w-4 h-4 text-blue-600" />
                  {shelter.name}
                </h3>
                <p className="text-sm flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  {shelter.address}
                </p>
                <div className="mt-2 text-xs text-gray-600">
                  <p>קיבולת: {shelter.capacity} אנשים</p>
                  {shelter.accessibility && <p className="text-green-600">נגיש לכסא גלגלים</p>}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}