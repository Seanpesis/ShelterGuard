
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Shield, MapPin, Navigation } from 'lucide-react';

// Fix for default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const shelterIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448628.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
});

const waypointIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // A simple dot icon
    iconSize: [15, 15],
    iconAnchor: [7, 7], // Center the icon
    popupAnchor: [0, -7] // Adjust popup position
});


export default function RouteMap({ route, shelters, polyline }) {
  const defaultCenter = [32.0853, 34.7818]; // Tel Aviv
  const center = polyline && polyline.length > 0 ? polyline[Math.floor(polyline.length / 2)] : defaultCenter;
  
  const bounds = polyline && polyline.length > 0 ? polyline : [defaultCenter];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="w-5 h-5" />
          מפת המסלול
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[400px] p-0">
        <MapContainer bounds={bounds} zoom={13} style={{ height: '100%', width: '100%', borderBottomLeftRadius: '0.5rem', borderBottomRightRadius: '0.5rem' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {polyline && polyline.length > 0 && <Polyline positions={polyline} color="blue" />}
          
          {shelters.map(shelter => (
            <Marker key={shelter.id} position={[shelter.latitude, shelter.longitude]} icon={shelterIcon}>
              <Popup>
                <div className="font-sans">
                  <h3 className="font-bold text-base mb-1 flex items-center gap-1"><Shield className="w-4 h-4 text-blue-600" />{shelter.name}</h3>
                  <p className="text-sm flex items-center gap-1"><MapPin className="w-4 h-4 text-gray-500" />{shelter.address}</p>
                </div>
              </Popup>
            </Marker>
          ))}
          
          {polyline && polyline.length > 0 && (
             <Marker position={polyline[0]}>
                <Popup><b>נקודת התחלה:</b><br/>{route.start_address}</Popup>
             </Marker>
          )}
          {polyline && polyline.length > 1 && (
             <Marker position={polyline[polyline.length - 1]}>
                <Popup><b>נקודת סיום:</b><br/>{route.end_address}</Popup>
             </Marker>
          )}
          
          {route.waypoints && route.waypoints.map((waypoint, index) => (
            waypoint.latitude && waypoint.longitude && (
              <Marker key={`wp-${index}`} position={[waypoint.latitude, waypoint.longitude]} icon={waypointIcon}>
                <Popup><b>עצירה {index + 1}:</b><br/>{waypoint.address}</Popup>
              </Marker>
            )
          ))}

        </MapContainer>
      </CardContent>
    </Card>
  );
}
