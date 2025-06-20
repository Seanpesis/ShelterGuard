import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";

const colorClasses = {
  blue: "from-blue-500 to-blue-600 text-blue-600",
  green: "from-green-500 to-green-600 text-green-600", 
  purple: "from-purple-500 to-purple-600 text-purple-600",
  orange: "from-orange-500 to-orange-600 text-orange-600"
};

export default function StatsCard({ title, value, icon: Icon, color, trend }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className={`absolute -top-2 -right-2 lg:-top-4 lg:-right-4 w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-r ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[1]} rounded-full opacity-10`} />
        <CardHeader className="pb-1 lg:pb-2">
          <div className="flex items-center justify-between">
            <p className="text-xs lg:text-sm font-medium text-gray-600 leading-tight">{title}</p>
            <div className={`p-1.5 lg:p-2 rounded-lg bg-gradient-to-r ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[1]} bg-opacity-10`}>
              <Icon className={`w-4 h-4 lg:w-5 lg:h-5 ${colorClasses[color].split(' ')[2]}`} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-xl lg:text-3xl font-bold text-gray-900 mb-1">
            {value}
          </div>
          {trend && (
            <p className="text-xs text-gray-500 font-medium">
              {trend}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}