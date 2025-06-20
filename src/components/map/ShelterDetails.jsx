
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Shield, MapPin, Users, Phone, Wifi } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ShelterDetails({ shelter, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            פרטי מקלט
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <h3 className="font-bold text-lg text-gray-900">{shelter.name}</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
              <span>{shelter.address}, {shelter.city}</span>
            </p>
            <p className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>קיבולת: {shelter.capacity} אנשים</span>
            </p>
            {shelter.accessibility && (
              <p className="flex items-center gap-2 text-green-700 font-medium">
                <Wifi className="w-4 h-4" />
                <span>נגיש לכסא גלגלים</span>
              </p>
            )}
            {shelter.contact_phone && (
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>איש קשר: {shelter.contact_phone}</span>
              </p>
            )}
            {shelter.notes && (
              <div className="pt-2 border-t mt-2">
                <p className="text-xs text-gray-500 italic">{shelter.notes}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
