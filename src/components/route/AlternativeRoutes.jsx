import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, Shield, ArrowRight, MapPin, Zap, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AlternativeRoutes({ routes, onSelectRoute, isLoading = false }) {
  if (!routes || routes.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <AlertTriangle className="w-5 h-5" />
            מסלולים חלופיים מומלצים
          </CardTitle>
          <p className="text-sm text-orange-700">
            המסלול הנוכחי אינו עובר ליד מקלטים. הנה אפשרויות חלופיות עם מקלטים בדרך:
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {routes.map((route, index) => (
            <motion.div
              key={route.id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg p-4 border border-orange-200 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-600" />
                    {route.name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {route.description}
                  </p>
                  
                  {/* נתונים מפורטים */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">{route.estimated_duration} דק'</span>
                      {route.additional_time > 0 && (
                        <span className="text-xs text-gray-500">(+{route.additional_time})</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span className="font-medium">{route.shelter_count} מקלטים</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-purple-600" />
                      <span className="font-medium">{route.distance_km} ק"מ</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="w-4 h-4 text-orange-600" />
                      <span className="font-medium">ציון: {route.safety_score}/100</span>
                    </div>
                  </div>

                  {/* רשימת מקלטים */}
                  {route.shelters && route.shelters.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-gray-700 mb-2">מקלטים בדרך:</p>
                      <div className="flex flex-wrap gap-1">
                        {route.shelters.slice(0, 3).map((shelter, shelterIndex) => (
                          <Badge 
                            key={shelterIndex} 
                            variant="outline" 
                            className="text-xs bg-green-50 text-green-700 border-green-200"
                          >
                            {shelter.name}
                          </Badge>
                        ))}
                        {route.shelters.length > 3 && (
                          <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600">
                            +{route.shelters.length - 3} נוספים
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => onSelectRoute(route)}
                  disabled={isLoading}
                  className="text-orange-700 border-orange-300 hover:bg-orange-100 flex-shrink-0"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 ml-1 animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4 ml-1" />
                  )}
                  {isLoading ? "יוצר..." : "בחר מסלול"}
                </Button>
              </div>
              
              <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                <Badge variant="outline" className="text-green-600 border-green-300 text-xs">
                  מסלול בטוח יותר
                </Badge>
                <Badge variant="outline" className="text-blue-600 border-blue-300 text-xs">
                  כיסוי מקלטים מעולה
                </Badge>
                {route.additional_time <= 5 && (
                  <Badge variant="outline" className="text-purple-600 border-purple-300 text-xs">
                    זמן נסיעה דומה
                  </Badge>
                )}
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}