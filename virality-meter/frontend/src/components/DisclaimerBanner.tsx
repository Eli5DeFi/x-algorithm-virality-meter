'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DisclaimerBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the banner before
    const dismissed = localStorage.getItem('disclaimer-dismissed');
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('disclaimer-dismissed', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-gradient-to-r from-term-amber/20 via-term-amber/10 to-term-amber/20 border-b-2 border-term-amber/50"
        >
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex items-start gap-3">
              {/* Warning Icon */}
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-5 h-5 rounded-full bg-term-amber/30 border border-term-amber flex items-center justify-center">
                  <span className="text-term-amber text-xs font-bold">!</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="font-mono text-xs text-gray-200 leading-relaxed">
                  <span className="text-term-amber font-bold">DISCLAIMER:</span> Results are{' '}
                  <span className="text-term-amber font-bold">estimates</span> based on the{' '}
                  <a
                    href="https://github.com/xai-org/x-algorithm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-term-cyan underline hover:text-term-cyan-bright"
                  >
                    open-source X algorithm base code
                  </a>
                  , not the production algorithm used by X. Accuracy is approximate. Use as a general guide for content optimization.
                </div>
              </div>

              {/* Dismiss Button */}
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 text-term-gray hover:text-term-amber transition-colors font-mono text-xs px-2 py-1 border border-term-border hover:border-term-amber"
                title="Dismiss disclaimer"
              >
                ✕
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
