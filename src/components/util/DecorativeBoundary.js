import { Component } from 'react';

/**
 * Error boundary for DECORATIVE subtrees (the About moon at 2026-09-10, DepthImage since 2026-09-12).
 * A decorative failure must stay decorative: without this, a Three.js
 * context failure (WebGL blocked, GPU blacklisted, context lost) bubbled to
 * the route error boundary and replaced the ENTIRE home page with
 * "Unexpected Application Error". Renders `fallback` (default: nothing) and
 * keeps the rest of the page alive.
 */
export default class DecorativeBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    if (typeof console !== 'undefined') {
      console.warn('[DecorativeBoundary] decorative component failed:', error?.message || error);
    }
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null;
    return this.props.children;
  }
}
