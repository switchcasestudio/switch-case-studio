import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import useReducedMotion from '../../hooks/useReducedMotion';

const SPRING_CONFIG = { damping: 100, stiffness: 400 };

/**
 * MagneticButton — pulls its contents toward the cursor while hovered, then
 * springs back to center on leave. Adapted from a framer-motion/TS/Tailwind
 * snippet to this project's motion/react + plain-JS setup.
 *
 * Reduced-motion safe: renders a static wrapper with no movement.
 * The global mousemove listener is only attached while hovered.
 *
 * @param {React.ReactNode} children
 * @param {number} distance - fraction of the cursor offset to follow (0–1)
 * @param {string} className
 */
const MagneticButton = ({ children, distance = 0.6, className = '' }) => {
  const reduced = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING_CONFIG);
  const springY = useSpring(y, SPRING_CONFIG);

  // Follow the cursor only while hovered (listener detached otherwise).
  useEffect(() => {
    if (reduced || !isHovered) return;

    const onMove = (e) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      x.set((e.clientX - centerX) * distance);
      y.set((e.clientY - centerY) * distance);
    };

    document.addEventListener('mousemove', onMove);
    return () => document.removeEventListener('mousemove', onMove);
  }, [isHovered, reduced, distance, x, y]);

  // Snap back to center when the cursor leaves.
  useEffect(() => {
    if (!isHovered) {
      x.set(0);
      y.set(0);
    }
  }, [isHovered, x, y]);

  return (
    <motion.div
      ref={ref}
      className={`magnetic-button ${className}`.trim()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'inline-flex',
        x: reduced ? 0 : springX,
        y: reduced ? 0 : springY,
      }}
    >
      {children}
    </motion.div>
  );
};

export default MagneticButton;
