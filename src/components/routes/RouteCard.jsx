import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Route as RouteIcon, Clock, Shield, MapPin, Calendar, CheckCircle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export default function RouteCard({ route, onUpdateStatus }) {
  const getStatusInfo = (status) => {
    switch (status) {
      case 'active': return { text: 'פעיל', color: 'bg-green-100 text-green-800 border-green-200' };
      case 'completed': return { text: 'הושלם', color: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'planned': return { text: 'מתוכנן', color: 'bg-orange-100 text-orange-800 border-orange-200' };
      default: return { text: status, color: 'bg-gray-100 text-gray-800 border-gray-200' };
    }
  };

  const statusInfo = getStatusInfo(route.status);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.02 }} className="transition-transform">
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2"><h3 className="font-bold text-lg text-gray-900">{route.name || 'מסלול ללא שם'}</h3><Badge variant="outline" className={statusInfo.color}>{statusInfo.text}</Badge></div>
              <div className="text-sm text-gray-600 mb-4">
                <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /><span>מ: {route.start_address}</span></p>
                <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /><span>אל: {route.end_address}</span></p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-gray-600"><Clock className="w-4 h-4" /><span>{route.estimated_duration || 'N/A'} דקות</span></div>
                <div className="flex items-center gap-1 text-gray-600"><Shield className="w-4 h-4" /><span>{route.shelter_count || 0} מקלטים</span></div>
              </div>
            </div>
            <div className="flex flex-col items-end justify-between gap-4">
              <div className="text-xs text-gray-500 flex items-center gap-1"><Calendar className="w-3 h-3" /><span>נוצר: {format(new Date(route.created_date), 'd/M/yyyy')}</span></div>
              {route.status !== 'completed' && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => onUpdateStatus(route.id, 'removed')}><Trash2 className="w-4 h-4 ml-2" />הסר</Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => onUpdateStatus(route.id, 'completed')}><CheckCircle className="w-4 h-4 ml-2" />סמן כהושלם</Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}