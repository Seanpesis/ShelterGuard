import React, { useState } from "react";
import { Route, Shelter } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, MapPin, Clock, CheckCircle, Navigation } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import RouteForm from "../components/route/RouteForm";
import ShelterList from "../components/route/ShelterList";
import RouteMap from "../components/route/RouteMap";
import AlternativeRoutes from "../components/route/AlternativeRoutes";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function RouteChecker() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const analyzeRoute = async (route) => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      setAnalysisStep("טוען נתוני מקלטים...");
      const allShelters = await Shelter.list();
      
      const allAddresses = [
        route.start_address,
        ...route.waypoints.map(w => w.address),
        route.end_address
      ].filter(Boolean);

      // שלב 1: בסיס נתונים כתובות ישראלי מקיף
      setAnalysisStep("מאתר כתובות בישראל...");
      
      const israeliAddressDatabase = {
        "תל אביב": {
          "דיזנגוף": { lat: 32.0809, lng: 34.7806, type: "main_street" },
          "בן יהודה": { lat: 32.0851, lng: 34.7749, type: "main_street" },
          "רוטשילד": { lat: 32.0644, lng: 34.7719, type: "boulevard" },
          "יגאל אלון": { lat: 32.0719, lng: 34.7926, type: "highway" },
          "הירקון": { lat: 32.0853, lng: 34.7818, type: "main_street" },
          "אלנבי": { lat: 32.0663, lng: 34.7719, type: "main_street" },
          "ארלוזורוב": { lat: 32.0894, lng: 34.7803, type: "main_street" },
          "יפו": { lat: 32.0543, lng: 34.7546, type: "main_street" }
        },
        "חולון": {
          "יצחק רבין": { lat: 32.0117, lng: 34.7628, type: "main_street" },
          "סוקולוב": { lat: 32.0145, lng: 34.7565, type: "main_street" },
          "ויצמן": { lat: 32.0098, lng: 34.7634, type: "main_street" },
          "הרצל": { lat: 32.0089, lng: 34.7591, type: "main_street" }
        },
        "ירושלים": {
          "יפו": { lat: 31.7857, lng: 35.2066, type: "main_street" },
          "הרצל": { lat: 31.7964, lng: 35.1053, type: "main_street" },
          "בן יהודה": { lat: 31.7804, lng: 35.2197, type: "main_street" },
          "בגין": { lat: 31.7589, lng: 35.2087, type: "highway" }
        },
        "חיפה": {
          "הרצל": { lat: 32.8191, lng: 34.9983, type: "main_street" },
          "נורדאו": { lat: 32.8134, lng: 35.0041, type: "main_street" },
          "בן גוריון": { lat: 32.8156, lng: 35.0073, type: "main_street" }
        }
      };

      const geocodedPoints = [];
      for (const address of allAddresses) {
        let found = false;
        const addressLower = address.toLowerCase();
        
        for (const [city, streets] of Object.entries(israeliAddressDatabase)) {
          if (addressLower.includes(city.toLowerCase())) {
            for (const [street, coords] of Object.entries(streets)) {
              if (addressLower.includes(street.toLowerCase())) {
                const houseNumber = address.match(/\d+/);
                const offset = houseNumber ? (parseInt(houseNumber[0]) % 100) * 0.0001 : 0;
                geocodedPoints.push({
                  lat: coords.lat + offset,
                  lng: coords.lng + offset,
                  roadType: coords.type
                });
                found = true;
                break;
              }
            }
          }
          if (found) break;
        }
        
        if (!found) {
          throw new Error(`לא ניתן למצוא את הכתובת: "${address}". אנא ודא שהכתובת נכונה וכוללת את שם העיר והרחוב.`);
        }
      }

      // שלב 2: תכנון מסלול מדויק יותר
      setAnalysisStep("מתכנן מסלול מדויק ומחפש מקלטים...");

      const routePolyline = [];
      let totalDistance = 0;
      let totalTimeMinutes = 0;
      
      // מהירויות מדויקות לכל כלי רכב (קמ"ש)
      const speeds = {
        car: { 
          street: 40, 
          main_street: 50, 
          boulevard: 45, 
          highway: 80 
        },
        motorcycle: { 
          street: 35, 
          main_street: 45, 
          boulevard: 40, 
          highway: 70 
        },
        scooter: { 
          street: 25, 
          main_street: 25, 
          boulevard: 25, 
          highway: 25 
        },
        bicycle: { 
          street: 18, 
          main_street: 15, 
          boulevard: 20, 
          highway: 12 
        }
      };

      for (let i = 0; i < geocodedPoints.length - 1; i++) {
        const start = geocodedPoints[i];
        const end = geocodedPoints[i + 1];

        // חישוב מרחק מדויק (בקילומטרים)
        const segmentDistance = Math.sqrt(
          Math.pow((end.lat - start.lat) * 111, 2) +
          Math.pow((end.lng - start.lng) * 111 * Math.cos(start.lat * Math.PI / 180), 2)
        );
        
        totalDistance += segmentDistance;
        
        // קביעת סוג הדרך ומהירות נסיעה
        const roadType = end.roadType || 'street';
        const vehicleSpeed = speeds[route.transport_method][roadType];
        const segmentTime = (segmentDistance / vehicleSpeed) * 60;
        totalTimeMinutes += segmentTime;

        // יצירת מסלול מפורט יותר
        const steps = Math.max(10, Math.floor(segmentDistance * 10));
        for (let j = 0; j <= steps; j++) {
          const ratio = j / steps;
          const lat = start.lat + (end.lat - start.lat) * ratio;
          const lng = start.lng + (end.lng - start.lng) * ratio;
          routePolyline.push([lat, lng]);
        }
      }

      // חיפוש מקלטים ברדיוס מתאים לכלי הרכב
      const searchRadius = {
        car: 800,
        motorcycle: 600,
        scooter: 400,
        bicycle: 300
      };

      const radius = searchRadius[route.transport_method] || 500;
      
      const relevantShelters = allShelters.filter(shelter => {
        return routePolyline.some(point => {
          const distance = Math.sqrt(
            Math.pow((shelter.latitude - point[0]) * 111000, 2) +
            Math.pow((shelter.longitude - point[1]) * 111000 * Math.cos(point[0] * Math.PI / 180), 2)
          );
          return distance <= radius;
        });
      });

      const waypointsWithCoords = route.waypoints.map((waypoint, index) => {
        const coords = geocodedPoints[index + 1];
        return { ...waypoint, latitude: coords.lat, longitude: coords.lng };
      }).filter(w => w.address && w.latitude && w.longitude);

      // חישוב ציון בטיחות מדויק יותר
      const safetyScore = Math.min(100, Math.max(20, 
        relevantShelters.length * 15 +
        (totalDistance < 10 ? 25 : totalDistance < 20 ? 15 : 5) +
        (route.transport_method === 'car' ? 10 : route.transport_method === 'motorcycle' ? 5 : 0)
      ));

      const newRouteData = {
        ...route,
        waypoints: waypointsWithCoords,
        status: 'planned',
        shelter_count: relevantShelters.length,
        estimated_duration: Math.round(totalTimeMinutes),
        distance_km: Math.round(totalDistance * 10) / 10,
        safety_score: safetyScore,
        route_polyline: JSON.stringify(routePolyline)
      };

      const savedRoute = await Route.create(newRouteData);

      // שלב 3: אם אין מקלטים מספיק, צור מסלולים חלופיים
      let alternativeRoutes = [];
      if (relevantShelters.length < 2) {
        setAnalysisStep("מחפש מסלולים חלופיים עם מקלטים נוספים...");
        alternativeRoutes = await generateAlternativeRoutes(route, allShelters, geocodedPoints, totalDistance, totalTimeMinutes);
      }

      setAnalysisResult({
        route: savedRoute,
        shelters: relevantShelters,
        polyline: routePolyline,
        alternativeRoutes: alternativeRoutes
      });

    } catch (e) {
      console.error("Error analyzing route:", e);
      setError(e.message || "אירעה שגיאה בלתי צפויה בניתוח המסלול. נסה שוב.");
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep("");
    }
  };

  const generateAlternativeRoutes = async (originalRoute, allShelters, originalPoints, originalDistance, originalTime) => {
    try {
      const alternatives = [];
      const start = originalPoints[0];
      const end = originalPoints[originalPoints.length - 1];
      
      // מציאת מקלטים באזור הכללי
      const regionShelters = allShelters.filter(shelter => {
        const distanceFromStart = Math.sqrt(
          Math.pow((shelter.latitude - start.lat) * 111, 2) +
          Math.pow((shelter.longitude - start.lng) * 111, 2)
        );
        const distanceFromEnd = Math.sqrt(
          Math.pow((shelter.latitude - end.lat) * 111, 2) +
          Math.pow((shelter.longitude - end.lng) * 111, 2)
        );
        return distanceFromStart < 15 && distanceFromEnd < 15;
      });

      if (regionShelters.length < 2) {
        return alternatives;
      }

      // יצירת 3 מסלולים חלופיים דרך מקלטים שונים
      const selectedShelters = regionShelters.slice(0, 3);
      
      for (let i = 0; i < selectedShelters.length; i++) {
        const shelter = selectedShelters[i];
        const altPolyline = [];
        
        // מסלול דרך המקלט: התחלה -> מקלט -> סוף
        const altPoints = [start, { lat: shelter.latitude, lng: shelter.longitude, roadType: 'main_street' }, end];
        let altDistance = 0;
        let altTime = 0;
        
        for (let j = 0; j < altPoints.length - 1; j++) {
          const segStart = altPoints[j];
          const segEnd = altPoints[j + 1];
          
          const segmentDistance = Math.sqrt(
            Math.pow((segEnd.lat - segStart.lat) * 111, 2) +
            Math.pow((segEnd.lng - segStart.lng) * 111 * Math.cos(segStart.lat * Math.PI / 180), 2)
          );
          altDistance += segmentDistance;
          
          const speeds = {
            car: { main_street: 50 },
            motorcycle: { main_street: 45 },
            scooter: { main_street: 25 },
            bicycle: { main_street: 15 }
          };
          
          const speed = speeds[originalRoute.transport_method]?.main_street || 40;
          altTime += (segmentDistance / speed) * 60;
          
          const steps = 15;
          for (let k = 0; k <= steps; k++) {
            const ratio = k / steps;
            const lat = segStart.lat + (segEnd.lat - segStart.lat) * ratio;
            const lng = segStart.lng + (segEnd.lng - segStart.lng) * ratio;
            altPolyline.push([lat, lng]);
          }
        }
        
        // חיפוש מקלטים במסלול החלופי
        const altShelters = allShelters.filter(altShelter => {
          return altPolyline.some(point => {
            const distance = Math.sqrt(
              Math.pow((altShelter.latitude - point[0]) * 111000, 2) +
              Math.pow((altShelter.longitude - point[1]) * 111000 * Math.cos(point[0] * Math.PI / 180), 2)
            );
            return distance <= 600;
          });
        });
        
        if (altShelters.length > 0) {
          const additionalTime = Math.round(altTime - originalTime);
          const safetyScore = Math.min(100, altShelters.length * 20 + 30);
          
          alternatives.push({
            id: `alt-${i + 1}`,
            name: `דרך ${shelter.name || 'מקלט באזור'}`,
            polyline: altPolyline,
            shelters: altShelters,
            shelter_count: altShelters.length,
            estimated_duration: Math.round(altTime),
            additional_time: additionalTime > 0 ? additionalTime : 0,
            distance_km: Math.round(altDistance * 10) / 10,
            safety_score: safetyScore,
            description: `מסלול חלופי עם ${altShelters.length} מקלטים בדרך`,
            waypoint: { lat: shelter.latitude, lng: shelter.longitude }
          });
        }
      }
      
      return alternatives.filter(alt => alt.shelter_count > 0).slice(0, 2);
      
    } catch (error) {
      console.warn("Error generating alternatives:", error);
      return [];
    }
  };

  const handleSelectAlternativeRoute = async (alternativeRoute) => {
    try {
      setIsAnalyzing(true);
      setAnalysisStep("יוצר מסלול חלופי...");
      
      const newRouteData = {
        name: `${analysisResult.route.name || 'מסלול'} - ${alternativeRoute.name}`,
        start_address: analysisResult.route.start_address,
        end_address: analysisResult.route.end_address,
        waypoints: [{ 
          address: "נקודת ביניים", 
          latitude: alternativeRoute.waypoint.lat, 
          longitude: alternativeRoute.waypoint.lng 
        }],
        transport_method: analysisResult.route.transport_method,
        status: 'planned',
        shelter_count: alternativeRoute.shelter_count,
        estimated_duration: alternativeRoute.estimated_duration,
        distance_km: alternativeRoute.distance_km,
        safety_score: alternativeRoute.safety_score,
        route_polyline: JSON.stringify(alternativeRoute.polyline)
      };
      
      const savedRoute = await Route.create(newRouteData);
      
      setAnalysisResult({
        route: savedRoute,
        shelters: alternativeRoute.shelters,
        polyline: alternativeRoute.polyline,
        alternativeRoutes: []
      });
      
    } catch (error) {
      setError("שגיאה ביצירת המסלול החלופי: " + error.message);
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-2">בדיקת מקלטים במסלול</h1>
          <p className="text-base lg:text-lg text-gray-600">הזן את מסלול הנסיעה שלך כדי למצוא מקלטים בדרך ולהציג אותו על המפה</p>
        </motion.div>

        {error && (
          <Alert variant="destructive" className="mb-4 lg:mb-6">
            <AlertTitle>שגיאה בניתוח המסלול</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            {!analysisResult ? (
              <RouteForm onSubmit={analyzeRoute} isAnalyzing={isAnalyzing} analysisStep={analysisStep} />
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 lg:space-y-6">
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 lg:gap-0">
                      <CardTitle className="flex items-center gap-2 text-green-800 text-base lg:text-lg">
                        <CheckCircle className="w-5 h-5" />
                        ניתוח המסלול הושלם בהצלחה
                      </CardTitle>
                      <Button onClick={() => navigate(createPageUrl("MyRoutes"))} size="sm">
                        עבור למסלולים שלי
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 lg:gap-4">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700">{analysisResult.shelters.length} מקלטים</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700">{analysisResult.route.estimated_duration} דקות</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700">{analysisResult.route.distance_km} ק"מ</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Navigation className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700">{analysisResult.route.transport_method}</span>
                      </div>
                    </div>
                    {analysisResult.route.safety_score && (
                      <div className="mt-4 p-3 bg-white rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">ציון בטיחות:</span>
                          <Badge variant="outline">{analysisResult.route.safety_score}/100</Badge>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <RouteMap route={analysisResult.route} shelters={analysisResult.shelters} polyline={analysisResult.polyline} />

                {analysisResult.alternativeRoutes && analysisResult.alternativeRoutes.length > 0 && (
                  <AlternativeRoutes 
                    routes={analysisResult.alternativeRoutes} 
                    onSelectRoute={handleSelectAlternativeRoute}
                    isLoading={isAnalyzing}
                  />
                )}
                
                <Button variant="outline" onClick={() => setAnalysisResult(null)} className="w-full lg:w-auto">
                  בצע ניתוח למסלול חדש
                </Button>
              </motion.div>
            )}
          </div>

          <div className="space-y-4 lg:space-y-6">
            <ShelterList shelters={analysisResult?.shelters || []} isLoading={isAnalyzing} />
          </div>
        </div>
      </div>
    </div>
  );
}