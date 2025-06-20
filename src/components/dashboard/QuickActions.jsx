import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Route, MapPin, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

export default function QuickActions() {
  const actions = [
    {
      title: "בדיקת מסלול חדש",
      description: "נתח מסלול למציאת מקלטים",
      icon: Route,
      color: "blue",
      url: createPageUrl("RouteChecker")
    },
    {
      title: "צפה במפת המקלטים",
      description: "סייר בכל המקלטים הזמינים",
      icon: MapPin,
      color: "green", 
      url: createPageUrl("ShelterMap")
    },
    {
      title: "מידע חירום",
      description: "גישה מהירה לאנשי קשר",
      icon: AlertTriangle,
      color: "red",
      url: createPageUrl("Emergency")
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
          <Route className="w-5 h-5" />
          פעולות מהירות
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
          {actions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={action.url}>
                <Button
                  variant="outline"
                  className={`w-full h-auto p-4 lg:p-4 flex flex-col items-center justify-center gap-2 lg:gap-3 text-center hover:shadow-lg transition-all duration-300 ${
                    action.color === 'blue' ? 'hover:bg-blue-50 hover:border-blue-300' :
                    action.color === 'green' ? 'hover:bg-green-50 hover:border-green-300' :
                    'hover:bg-red-50 hover:border-red-300'
                  }`}
                >
                  <action.icon className={`w-6 h-6 lg:w-8 lg:h-8 mb-1 lg:mb-2 ${
                    action.color === 'blue' ? 'text-blue-600' :
                    action.color === 'green' ? 'text-green-600' :
                    'text-red-600'
                  }`} />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm lg:text-base">
                      {action.title}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {action.description}
                    </p>
                  </div>
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}