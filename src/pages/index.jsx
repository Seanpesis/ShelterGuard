import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import RouteChecker from "./RouteChecker";

import ShelterMap from "./ShelterMap";

import MyRoutes from "./MyRoutes";

import Emergency from "./Emergency";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    RouteChecker: RouteChecker,
    
    ShelterMap: ShelterMap,
    
    MyRoutes: MyRoutes,
    
    Emergency: Emergency,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/RouteChecker" element={<RouteChecker />} />
                
                <Route path="/ShelterMap" element={<ShelterMap />} />
                
                <Route path="/MyRoutes" element={<MyRoutes />} />
                
                <Route path="/Emergency" element={<Emergency />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}