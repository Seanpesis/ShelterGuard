

import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Shield, MapPin, Route, Settings, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@/api/entities";

const navigationItems = [
  {
    title: "לוח בקרה",
    url: createPageUrl("Dashboard"),
    icon: Shield,
  },
  {
    title: "בדיקת מסלול",
    url: createPageUrl("RouteChecker"),
    icon: Route,
  },
  {
    title: "מפת מקלטים",
    url: createPageUrl("ShelterMap"),
    icon: MapPin,
  },
  {
    title: "המסלולים שלי",  
    url: createPageUrl("MyRoutes"),
    icon: Settings,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'he';
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      // User not logged in. Force the platform's login flow.
      console.log('User not authenticated, redirecting to login.');
      try {
        await User.login();
      } catch (loginError) {
         console.error("Could not redirect to login page:", loginError);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await User.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div dir="rtl">
      <style>
        {`
          :root {
            --primary-blue: #0066cc;
            --primary-light: #e6f2ff;
            --safety-red: #dc2626;
            --safety-green: #059669;
            --warning-orange: #ea580c;
            --israeli-blue: #0038a8;
            --text-dark: #1f2937;
            --text-light: #6b7280;
          }
          body {
            font-family: 'Arial', sans-serif;
          }
          @media (max-width: 1024px) {
            .mobile-hidden {
              display: none;
            }
          }
        `}
      </style>
      
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-slate-50">
        
        {/* Desktop Sidebar (Right) */}
        <aside className="mobile-hidden w-72 flex-shrink-0 bg-white/95 backdrop-blur-sm border-l border-blue-200 flex flex-col">
          {/* Sidebar Header */}
          <div className="border-b border-blue-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg">ShelterGuard</h2>
                <p className="text-xs text-blue-600 font-medium">משמר המקלט</p>
              </div>
            </div>
            {user && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">
                  שלום, {user.full_name || user.email}
                </p>
                <button
                  onClick={handleLogout}
                  className="text-xs text-blue-600 hover:text-blue-800 mt-1 transition-colors"
                >
                  יציאה
                </button>
              </div>
            )}
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <span className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">ניווט</span>
            {navigationItems.map((item) => (
              <Link
                key={item.title}
                to={item.url}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  location.pathname === item.url 
                    ? 'bg-blue-100 text-blue-700 font-bold shadow-sm' 
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.title}</span>
              </Link>
            ))}
          </nav>

          {/* Emergency Info */}
          <div className="p-4 border-t border-blue-200">
            <span className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 block">חירום</span>
            <div className="px-2 py-1 space-y-2">
              <a href="tel:104" className="flex items-center gap-3 text-sm p-2 rounded-lg hover:bg-red-50 transition-colors group">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-gray-700 font-medium group-hover:text-red-700">פיקוד העורף: 104</span>
              </a>
              <a href="tel:100" className="flex items-center gap-3 text-sm p-2 rounded-lg hover:bg-orange-50 transition-colors group">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-gray-700 font-medium group-hover:text-orange-700">משטרה: 100</span>
              </a>
              <a href="tel:101" className="flex items-center gap-3 text-sm p-2 rounded-lg hover:bg-blue-50 transition-colors group">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700 font-medium group-hover:text-blue-700">מד"א: 101</span>
              </a>
            </div>
          </div>
        </aside>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={closeMobileMenu}>
            <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50" onClick={(e) => e.stopPropagation()}>
              {/* Mobile Menu Header */}
              <div className="border-b border-blue-200 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">ShelterGuard</h2>
                    <p className="text-xs text-blue-600 font-medium">משמר המקלט</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={closeMobileMenu}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {user && (
                <div className="p-4 bg-blue-50 border-b border-blue-200">
                  <p className="text-sm text-blue-800 font-medium">
                    שלום, {user.full_name || user.email}
                  </p>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-blue-600 hover:text-blue-800 mt-1 transition-colors"
                  >
                    יציאה
                  </button>
                </div>
              )}
              
              {/* Mobile Navigation */}
              <nav className="p-4 space-y-2">
                <span className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">ניווט</span>
                {navigationItems.map((item) => (
                  <Link
                    key={item.title}
                    to={item.url}
                    onClick={closeMobileMenu}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      location.pathname === item.url 
                        ? 'bg-blue-100 text-blue-700 font-bold' 
                        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                ))}
              </nav>

              {/* Mobile Emergency Info */}
              <div className="p-4 border-t border-blue-200 mt-auto">
                <span className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 block">חירום</span>
                <div className="px-2 py-1 space-y-2">
                  <a href="tel:104" className="flex items-center gap-3 text-sm p-2 rounded-lg hover:bg-red-50 transition-colors group">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-gray-700 font-medium group-hover:text-red-700">פיקוד העורף: 104</span>
                  </a>
                  <a href="tel:100" className="flex items-center gap-3 text-sm p-2 rounded-lg hover:bg-orange-50 transition-colors group">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700 font-medium group-hover:text-orange-700">משטרה: 100</span>
                  </a>
                  <a href="tel:101" className="flex items-center gap-3 text-sm p-2 rounded-lg hover:bg-blue-50 transition-colors group">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700 font-medium group-hover:text-blue-700">מד"א: 101</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {/* Mobile Header */}
          <header className="lg:hidden bg-white/90 backdrop-blur-sm border-b border-blue-100 px-4 py-3 sticky top-0 z-30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                  <Menu className="w-5 h-5" />
                </Button>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h1 className="text-lg font-bold text-gray-900">ShelterGuard</h1>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          {children}
        </main>

      </div>
    </div>
  );
}

