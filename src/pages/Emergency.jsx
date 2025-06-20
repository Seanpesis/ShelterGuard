import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Phone, Shield, Ambulance, Flame } from "lucide-react";
import { motion } from "framer-motion";

export default function Emergency() {
  const emergencyNumbers = [
    {
      name: "פיקוד העורף",
      number: "104",
      description: "התרעות והנחיות בזמן חירום",
      icon: Shield,
      color: "bg-red-600",
      urgent: true
    },
    {
      name: "משטרה",
      number: "100", 
      description: "דיווח על אירועי ביטחון ופשיעה",
      icon: Shield,
      color: "bg-blue-600",
      urgent: true
    },
    {
      name: "מד\"א",
      number: "101",
      description: "שירותי רפואה דחופים",
      icon: Ambulance,
      color: "bg-green-600",
      urgent: true
    },
    {
      name: "כבאות והצלה",
      number: "102",
      description: "דיווח על שריפות וחילוץ",
      icon: Flame,
      color: "bg-orange-600",
      urgent: true
    },
    {
      name: "חברת החשמל - תקלות",
      number: "103",
      description: "דיווח תקלות חשמל",
      icon: Phone,
      color: "bg-yellow-600",
      urgent: false
    },
    {
      name: "מוקד עירוני",
      number: "106",
      description: "שירותים עירוניים ומידע כללי",
      icon: Phone,
      color: "bg-purple-600",
      urgent: false
    }
  ];

  const handleCall = (number) => {
    window.open(`tel:${number}`, '_self');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            מספרי חירום
          </h1>
          <p className="text-lg text-gray-600">
            מספרי טלפון חיוניים לשעת חירום
          </p>
        </motion.div>

        <div className="bg-red-100 border border-red-300 rounded-xl p-4 mb-8 flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-red-600 animate-pulse" />
          <div>
            <h3 className="font-bold text-red-800">הודעה חשובה</h3>
            <p className="text-red-700">בשעת חירום אמיתית, התקשר מיד למספרים הרשומים למטה</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {emergencyNumbers.map((emergency, index) => (
            <motion.div
              key={emergency.number}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`hover:shadow-lg transition-all duration-300 ${emergency.urgent ? 'ring-2 ring-red-200' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${emergency.color} rounded-lg flex items-center justify-center`}>
                        <emergency.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{emergency.name}</h3>
                        {emergency.urgent && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                            דחוף
                          </span>
                        )}
                      </div>
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 text-sm">
                    {emergency.description}
                  </p>
                  <Button
                    onClick={() => handleCall(emergency.number)}
                    className={`w-full ${emergency.color} hover:opacity-90 text-white py-3`}
                    size="lg"
                  >
                    <Phone className="w-5 h-5 ml-2" />
                    התקשר {emergency.number}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            הנחיות חשובות:
          </h3>
          <ul className="text-blue-800 space-y-2">
            <li>• שמור על קור רוח ורגישות</li>
            <li>• דבר בבירור ומסור פרטים מדויקים</li>
            <li>• ציין את מיקומך המדויק</li>
            <li>• אל תנתק עד שיבקשו ממך</li>
            <li>• פעל לפי ההנחיות שתקבל</li>
          </ul>
        </div>
      </div>
    </div>
  );
}