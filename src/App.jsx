import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LearnPage from './pages/LearnPage';
import PracticePage from './pages/PracticePage';
import TenseConverterPage from './pages/TenseConverterPage';
import About from './pages/AboutPage';
import BottomNav from './components/BottomNav';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './contexts/ThemeContext';

const TenseDetailPage = () => (
  <div className="p-8 max-w-xl mx-auto">
    <h2>Tense Detail Page</h2>
    <p>Content goes here.</p>
  </div>
);

function App() {
  const location = useLocation();

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative transition-colors duration-300">
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/learn/:tenseId" element={<TenseDetailPage />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/converter" element={<TenseConverterPage />} />
          </Routes>
        </main>

        <BottomNav />
      </div>
    </ThemeProvider>
  );
}

export default App;
