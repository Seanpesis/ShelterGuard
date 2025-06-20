import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { motion } from 'framer-motion';

const colorClasses = {
  blue: "from-blue-500 to-blue-600 text-blue-600",
  green: "from-green-500 to-green-600 text-green-600",
  purple: "from-purple-500 to-purple-600 text-purple-600",
  orange: "from-orange-500 to-orange-600 text-orange-600"
};

export default function RouteStats({ title, value, icon: Icon, color }) {
  // Ensure color is valid, otherwise fallback to a default to prevent crashes
  const safeColor = color && colorClasses[color] ? color : 'blue';
  const colorSet = colorClasses[safeColor].split(' '); // [from, to, text]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
        <div className={`absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r ${colorSet[0]} ${colorSet[1]} rounded-full opacity-10`} />
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <div className={`p-2 rounded-lg bg-gradient-to-r ${colorSet[0]} ${colorSet[1]} bg-opacity-10`}>
              {Icon && <Icon className={`w-5 h-5 ${colorSet[2]}`} />}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">
            {value}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}