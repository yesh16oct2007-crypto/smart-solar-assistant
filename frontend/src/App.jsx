import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SolarChatbot from './components/SolarChatbot';
import HomePage from './pages/HomePage';
import RecommendationPage from './pages/RecommendationPage';
import CalculatorPage from './pages/CalculatorPage';
import ComparisonPage from './pages/ComparisonPage';
import DashboardPage from './pages/DashboardPage';
import PromptLabPage from './pages/PromptLabPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

export default function App() {
  // Sync page state with URL hash
  const getInitialPage = () => {
    const hash = window.location.hash.replace('#', '').trim();
    const validPages = ['home', 'recommendation', 'calculator', 'comparison', 'dashboard', 'prompt-lab', 'about', 'contact'];
    return validPages.includes(hash) ? hash : 'home';
  };

  const [activePage, setActivePage] = useState(getInitialPage);
  const [sharedRecommendation, setSharedRecommendation] = useState(null);

  // Update hash when active page changes
  const handlePageChange = (pageId) => {
    setActivePage(pageId);
    window.location.hash = pageId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Listen to browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      const validPages = ['home', 'recommendation', 'calculator', 'comparison', 'dashboard', 'prompt-lab', 'about', 'contact'];
      if (validPages.includes(hash)) {
        setActivePage(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfdfc] text-navy-900 font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar activePage={activePage} setActivePage={handlePageChange} />

      {/* Main Page Content */}
      <main className="flex-1">
        {activePage === 'home' && <HomePage setActivePage={handlePageChange} />}
        {activePage === 'recommendation' && (
          <RecommendationPage 
            setActivePage={handlePageChange} 
            setSharedRecommendation={setSharedRecommendation} 
          />
        )}
        {activePage === 'calculator' && (
          <CalculatorPage 
            setActivePage={handlePageChange} 
          />
        )}
        {activePage === 'comparison' && (
          <ComparisonPage 
            setActivePage={handlePageChange} 
          />
        )}
        {activePage === 'dashboard' && (
          <DashboardPage 
            setActivePage={handlePageChange} 
            sharedRecommendation={sharedRecommendation} 
          />
        )}
        {activePage === 'prompt-lab' && (
          <PromptLabPage />
        )}
        {activePage === 'about' && (
          <AboutPage setActivePage={handlePageChange} />
        )}
        {activePage === 'contact' && (
          <ContactPage />
        )}
      </main>

      {/* Floating SolarAI Assistant Chatbot */}
      <SolarChatbot />

      {/* Comprehensive Site Footer */}
      <Footer setActivePage={handlePageChange} />

    </div>
  );
}
