
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield, MapPin, Users, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ShelterList({ shelters, isLoading }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          מקלטים בקרבת מקום
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <AnimatePresence>
            {isLoading ? (
              Array(4).fill(0).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-2"
                >
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </motion.div>
              ))
            ) : shelters.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>לא נמצאו מקלטים במסלול זה.</p>
              </div>
            ) : (
              shelters.map((shelter, index) => (
                <motion.div
                  key={shelter.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {shelter.name}
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{shelter.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>קיבולת: {shelter.capacity}</span>
                    </div>
                    {shelter.accessibility && (
                      <div className="flex items-center gap-2 text-green-600">
                        <Wifi className="w-4 h-4" />
                        <span>נגיש לכסא גלגלים</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
