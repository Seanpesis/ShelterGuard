
import React, { useState, useEffect } from "react";
import { Route, Shelter, User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Shield, MapPin, Route as RouteIcon, AlertTriangle, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import StatsCard from "../components/dashboard/StatsCard";
import QuickActions from "../components/dashboard/QuickActions";
import RecentRoutes from "../components/dashboard/RecentRoutes";
import ShelterStatus from "../components/dashboard/ShelterStatus";

export default function Dashboard() {
  const [routes, setRoutes] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [routesData, sheltersData, userData] = await Promise.all([
        Route.filter({ created_by: (await User.me()).email }, "-created_date", 10),
        Shelter.list(),
        User.me()
      ]);
      setRoutes(routesData);
      setShelters(sheltersData);
      setUser(userData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const activeRoutes = routes.filter(route => route.status === 'active').length;
  const completedToday = routes.filter(route => 
    route.status === 'completed' && 
    new Date(route.updated_date).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 lg:mb-8"
        >
          <div className="flex flex-col gap-4 lg:gap-6">
            <div>
              <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-2">
                שלום {user?.full_name || user?.email || 'נהג'}! 👋
              </h1>
              <p className="text-base lg:text-lg text-gray-600">
                בדוק את המסלולים ומצא מקלטים בקרבת מקום
              </p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 lg:p-4 flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 lg:w-5 lg:h-5 text-red-600" />
              <span className="text-sm lg:text-base text-red-800 font-medium">סע בזהירות ושמור על עצמך</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
          <StatsCard
            title="סך הכל מקלטים"
            value={shelters.length}
            icon={Shield}
            color="blue"
            trend="12+ נוספו החודש"
          />
          <StatsCard
            title="מסלולים פעילים"
            value={activeRoutes}
            icon={RouteIcon}
            color="green"
            trend="בנסיעה כעת"
          />
          <StatsCard
            title="הושלמו היום"
            value={completedToday}
            icon={TrendingUp}
            color="purple"
            trend="כל הכבוד!"
          />
          <StatsCard
            title="אזורי כיסוי"
            value="32"
            icon={MapPin}
            color="orange"
            trend="פריסה ארצית"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            <QuickActions />
            <RecentRoutes routes={routes} isLoading={isLoading} />
          </div>
          
          <div className="space-y-6 lg:space-y-8">
            <ShelterStatus shelters={shelters} />
          </div>
        </div>
      </div>
    </div>
  );
}
