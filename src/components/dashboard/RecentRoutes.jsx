
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Route as RouteIcon, Clock, Shield, MapPin } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function RecentRoutes({ routes, isLoading }) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>מסלולים אחרונים</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 h-20 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'planned': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RouteIcon className="w-5 h-5" />
          מסלולים אחרונים
        </CardTitle>
      </CardHeader>
      <CardContent>
        {routes.length === 0 ? (
          <div className="text-center py-8">
            <RouteIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">לא נוצרו מסלולים. התחל בבדיקת המסלול הראשון שלך!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {routes.slice(0, 5).map((route, index) => (
              <motion.div
                key={route.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {route.name || 'מסלול ללא שם'}
                    </h3>
                    <Badge className={getStatusColor(route.status)}>
                      {route.status === 'active' ? 'פעיל' : route.status === 'completed' ? 'הושלם' : 'מתוכנן'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{route.start_address}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{route.estimated_duration || 0} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="w-4 h-4" />
                      <span>{route.shelter_count || 0} shelters</span>
                    </div>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500">
                  {format(new Date(route.created_date), 'd/M/yy, HH:mm')}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
