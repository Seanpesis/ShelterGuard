
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus, Loader2, Route, Bike, Car, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const transportMethods = [
  { value: 'car', label: 'רכב', icon: Car, color: 'text-blue-600' },
  { value: 'motorcycle', label: 'אופנוע', icon: Zap, color: 'text-red-600' },
  { value: 'scooter', label: 'קורקינט חשמלי', icon: Zap, color: 'text-green-600' },
  { value: 'bicycle', label: 'אופניים', icon: Bike, color: 'text-purple-600' }
];

export default function RouteForm({ onSubmit, isAnalyzing, analysisStep }) {
  const [routeName, setRouteName] = useState('');
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const [waypoints, setWaypoints] = useState(['']);
  const [transportMethod, setTransportMethod] = useState('car');

  const handleWaypointChange = (index, value) => {
    const newWaypoints = [...waypoints];
    newWaypoints[index] = value;
    setWaypoints(newWaypoints);
  };

  const addWaypoint = () => {
    setWaypoints([...waypoints, '']);
  };

  const removeWaypoint = (index) => {
    setWaypoints(waypoints.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name: routeName,
      start_address: startAddress,
      end_address: endAddress,
      waypoints: waypoints.map(addr => ({ address: addr })).filter(wp => wp.address),
      transport_method: transportMethod
    });
  };

  const selectedTransport = transportMethods.find(t => t.value === transportMethod);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
            <Route className="w-5 h-5" />
            הזן פרטי מסלול
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="routeName" className="text-sm lg:text-base">שם המסלול (אופציונלי)</Label>
              <Input
                id="routeName"
                placeholder="לדוגמה: משלוחי בוקר תל אביב"
                value={routeName}
                onChange={(e) => setRouteName(e.target.value)}
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transportMethod" className="text-sm lg:text-base">אמצעי תחבורה</Label>
              <Select value={transportMethod} onValueChange={setTransportMethod}>
                <SelectTrigger className="text-base">
                  <SelectValue placeholder="בחר אמצעי תחבורה" />
                </SelectTrigger>
                <SelectContent>
                  {transportMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      <div className="flex items-center gap-2">
                        <method.icon className={`w-4 h-4 ${method.color}`} />
                        <span>{method.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedTransport && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                  <selectedTransport.icon className={`w-4 h-4 ${selectedTransport.color}`} />
                  <span>נבחר: {selectedTransport.label}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startAddress" className="text-sm lg:text-base">כתובת התחלה</Label>
                <Input
                  id="startAddress"
                  placeholder="לדוגמה: רחוב יגאל אלון 94, תל אביב"
                  value={startAddress}
                  onChange={(e) => setStartAddress(e.target.value)}
                  required
                  className="text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endAddress" className="text-sm lg:text-base">כתובת סיום</Label>
                <Input
                  id="endAddress"
                  placeholder="לדוגמה: רחוב הירקון 165, תל אביב"
                  value={endAddress}
                  onChange={(e) => setEndAddress(e.target.value)}
                  required
                  className="text-base"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm lg:text-base">נקודות עצירה</Label>
              <div className="space-y-2 mt-2">
                {waypoints.map((waypoint, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder={`עצירה ${index + 1}`}
                      value={waypoint}
                      onChange={(e) => handleWaypointChange(index, e.target.value)}
                      className="text-base"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeWaypoint(index)}
                      disabled={waypoints.length === 1}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addWaypoint}
                className="mt-2"
              >
                <Plus className="w-4 h-4 ml-2" />
                הוסף עצירה
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg py-3 text-base"
              disabled={isAnalyzing || !startAddress || !endAddress}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  {analysisStep || 'מעבד...'}
                </>
              ) : "נתח מסלול וחפש מקלטים"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
