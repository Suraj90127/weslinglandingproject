import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

const ScrollReveal = ({ 
  children, 
  delay = 0, 
  direction = 'up', 
  duration = 0.8,
  threshold = 0.1,
  once = true 
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-50px", threshold });
  const controls = useAnimation();

  const directions = {
    up: { y: 50, opacity: 0 },
    down: { y: -50, opacity: 0 },
    left: { x: 50, opacity: 0 },
    right: { x: -50, opacity: 0 },
    fade: { opacity: 0 },
    scale: { scale: 0.8, opacity: 0 },
  };

  useEffect(() => {
    if (isInView) {
      controls.start({
        y: 0,
        x: 0,
        scale: 1,
        opacity: 1,
        transition: {
          duration: duration,
          delay: delay,
          ease: [0.25, 0.25, 0.25, 0.75],
        },
      });
    }
  }, [isInView, controls, delay, duration]);

  return (
    <motion.div
      ref={ref}
      initial={directions[direction] || directions.up}
      animate={controls}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;