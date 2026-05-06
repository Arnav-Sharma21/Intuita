import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export default function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname}>
        {/* Enter overlay — monochrome white */}
        <motion.div
          className="fixed inset-0 z-[10000]"
          style={{ backgroundColor: '#F5F4F0', pointerEvents: 'none' as const }}
          initial={{ x: '100%' }}
          animate={{ x: '100%' }}
          exit={{ x: '0%' }}
          transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
        />
        <motion.div
          className="fixed inset-0 z-[10000]"
          style={{ backgroundColor: '#F5F4F0', pointerEvents: 'none' as const }}
          initial={{ x: '0%' }}
          animate={{ x: '-100%' }}
          transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
        />

        {/* Page content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
