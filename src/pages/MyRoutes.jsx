
import React, { useState, useEffect } from "react";
import { Route, User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, MapPin, Clock, CheckCircle, Trash2, Calendar, Route as RouteIcon, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import RouteCard from "../components/routes/RouteCard";
import RouteStats from "../components/routes/RouteStats";

export default function MyRoutes() {
  const [routes, setRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      const userRoutes = await Route.filter({ created_by: userData.email }, "-created_date");
      setRoutes(userRoutes);
      setUser(userData);
    } catch (error) {
      console.error("Error loading routes:", error);
    }
    setIsLoading(false);
  };

  const handleCompleteRoute = async (routeId) => {
    try {
      await Route.update(routeId, { status: "completed" });
      loadData(); // Refresh the list
    } catch (error) {
      console.error("Error completing route:", error);
    }
  };

  const handleRemoveRoute = async (routeId) => {
    if (window.confirm("האם אתה בטוח שברצונך להסיר את המסלול?")) {
      try {
        await Route.update(routeId, { status: "removed" });
        loadData(); // Refresh the list
      } catch (error) {
        console.error("Error removing route:", error);
      }
    }
  };

  const activeRoutes = routes.filter(route => route.status === 'active' || route.status === 'planned');
  const completedRoutes = routes.filter(route => route.status === 'completed');
  const removedRoutes = routes.filter(route => route.status === 'removed');

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'planned':
        return 'bg-yellow-100 text-yellow-800';
      case 'removed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'פעיל';
      case 'completed':
        return 'הושלם';
      case 'planned':
        return 'מתוכנן';
      case 'removed':
        return 'הוסר';
      default:
        return 'לא ידוע';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 p-4 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <Shield className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
            <p className="text-gray-500">טוען מסלולים...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            המסלולים שלי
          </h1>
          <p className="text-gray-600">
            נהל את כל המסלולים שיצרת - הושלם, הסר או תכנן מסלולים חדשים
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <RouteStats
                title="סך הכל מסלולים"
                value={routes.length}
                icon={RouteIcon}
                color="blue"
            />
            <RouteStats
                title="פעילים ומתוכננים"
                value={activeRoutes.length}
                icon={Activity}
                color="green"
            />
            <RouteStats
                title="מסלולים שהושלמו"
                value={completedRoutes.length}
                icon={CheckCircle}
                color="purple"
            />
        </div>

        {routes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              אין מסלולים עדיין
            </h3>
            <p className="text-gray-500 mb-6">
              התחל לבדוק מסלולים ולמצוא מקלטים בדרך
            </p>
            <Link to={createPageUrl("RouteChecker")}>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <MapPin className="w-5 h-5 ml-2" />
                בדוק מסלול חדש
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* Active/Planned Routes */}
            {activeRoutes.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  מסלולים פעילים ומתוכננים ({activeRoutes.length})
                </h2>
                <div className="grid gap-4">
                  {activeRoutes.map((route, index) => (
                    <motion.div
                      key={route.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-lg transition-all duration-300">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{route.name || "מסלול ללא שם"}</CardTitle>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge className={getStatusColor(route.status)}>
                                  {getStatusText(route.status)}
                                </Badge>
                                {route.transport_method && (
                                  <Badge variant="outline">
                                    {route.transport_method === 'car' ? 'רכב' :
                                     route.transport_method === 'motorcycle' ? 'אופנוע' :
                                     route.transport_method === 'scooter' ? 'קורקינט' : 'אופניים'}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleCompleteRoute(route.id)}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <CheckCircle className="w-4 h-4 ml-1" />
                                הושלם
                              </Button>
                              <Button
                                onClick={() => handleRemoveRoute(route.id)}
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4 ml-1" />
                                הסר
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <p className="font-medium">התחלה:</p>
                              <p>{route.start_address}</p>
                            </div>
                            <div>
                              <p className="font-medium">סיום:</p>
                              <p>{route.end_address}</p>
                            </div>
                            {route.estimated_duration && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <p>זמן נסיעה: {route.estimated_duration} דקות</p>
                              </div>
                            )}
                            {route.shelter_count && (
                              <div className="flex items-center gap-1">
                                <Shield className="w-4 h-4" />
                                <p>מקלטים בדרך: {route.shelter_count}</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Routes */}
            {completedRoutes.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  מסלולים שהושלמו ({completedRoutes.length})
                </h2>
                <div className="grid gap-4">
                  {completedRoutes.map((route, index) => (
                    <motion.div
                      key={route.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-lg transition-all duration-300 opacity-80">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{route.name || "מסלול ללא שם"}</CardTitle>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge className={getStatusColor(route.status)}>
                                  {getStatusText(route.status)}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  הושלם ב-{new Date(route.updated_date).toLocaleDateString('he-IL')}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <p className="font-medium">התחלה:</p>
                              <p>{route.start_address}</p>
                            </div>
                            <div>
                              <p className="font-medium">סיום:</p>
                              <p>{route.end_address}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
