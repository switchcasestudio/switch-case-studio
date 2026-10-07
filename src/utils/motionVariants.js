// Shared entrance animations — the "Reviews" (TestimonialsPage) load,
// reused across the standalone pages so they all animate identically.
const EASE = [0.25, 0.46, 0.45, 0.94];

// Grid / list: staggers its children in.
export const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// A single card / row: rises + scales up slightly.
export const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: EASE },
  },
};
