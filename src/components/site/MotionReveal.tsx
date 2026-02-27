'use client';

import { motion, useReducedMotion } from 'framer-motion';
import React from 'react';

type MotionRevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export default function MotionReveal({ children, className, delay = 0 }: MotionRevealProps) {
  // Use Framer Motion's built-in reduced motion handling where possible
  // or handle it via variants to avoid conditional rendering mismatch during hydration
  const reducedMotion = useReducedMotion();

  // Ensure consistent rendering on server and client initial render
  // If reduced motion is detected on client, we can still use motion.div but disable animations
  
  const variants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 },
  };

  if (reducedMotion) {
    // Return motion.div but with initial state matching visible to skip animation
    return (
      <div className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
      transition={{ duration: 0.45, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
}

