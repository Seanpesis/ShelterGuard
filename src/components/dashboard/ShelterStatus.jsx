
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, MapPin, Users } from "lucide-react"; // Phone icon is removed as per outline
import { motion } from "framer-motion";

export default function ShelterStatus({ shelters }) {
  const totalShelters = shelters.length;
  const publicShelters = shelters.filter(s => s.type === 'public').length;
  const accessibleShelters = shelters.filter(s => s.accessibility).length;
  const cities = [...new Set(shelters.map(s => s.city))].length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          סטטוס רשת המקלטים
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-4 rounded-lg bg-blue-50"
            >
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {totalShelters}
              </div>
              <div className="text-sm text-blue-700">Total Shelters</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="text-center p-4 rounded-lg bg-green-50"
            >
              <div className="text-2xl font-bold text-green-600 mb-1">
                {publicShelters}
              </div>
              <div className="text-sm text-green-700">Public Access</div>
            </motion.div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Accessible</span>
              </div>
              <Badge variant="outline" className="text-green-600">
                {accessibleShelters}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Cities Covered</span>
              </div>
              <Badge variant="outline" className="text-blue-600">
                {cities}
              </Badge>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-semibold text-gray-900 mb-3">
              מספרי חירום
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-gray-700 font-medium">פיקוד העורף: 104</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700 font-medium">משטרה: 100</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700 font-medium">מד"א: 101</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
