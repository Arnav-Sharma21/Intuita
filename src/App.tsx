import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useLenis } from '@/hooks/useLenis';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CustomCursor from '@/components/layout/CustomCursor';
import Preloader from '@/components/layout/Preloader';
import Home from '@/pages/Home';
import Wizard from '@/pages/Wizard';
import Results from '@/pages/Results';
import ToolInterface from '@/pages/ToolInterface';
import { AppProvider } from '@/context/AppContext';

function AnimatedRoutes({ loaded }: { loaded: boolean }) {
  const location = useLocation();
  const showNavFooter = location.pathname === '/';

  return (
    <>
      {showNavFooter && <Navbar />}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home loaded={loaded} />} />
            <Route path="/wizard" element={<Wizard />} />
            <Route path="/results" element={<Results />} />
            <Route path="/tool/:id" element={<ToolInterface />} />
            <Route path="*" element={<Home loaded={loaded} />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
      {showNavFooter && <Footer />}
    </>
  );
}

function AppContent() {
  useLenis();
  const [preloaderDone, setPreloaderDone] = useState(false);

  return (
    <>
      <CustomCursor />
      {!preloaderDone && <Preloader onComplete={() => setPreloaderDone(true)} />}
      <AnimatedRoutes loaded={preloaderDone} />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--bg-1)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-md)',
            fontSize: '0.85rem',
            fontFamily: "'Inter', sans-serif",
          },
        }}
      />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProvider>
  );
}
