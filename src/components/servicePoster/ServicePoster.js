import { Component, useCallback, useRef, useState } from "react";
import PosterFrame from "./PosterFrame";
import usePosterEngine from "./usePosterEngine";
import * as InRegister from "./posters/InRegister";
import * as BuiltToConvert from "./posters/BuiltToConvert";
import * as Workflow from "./posters/Workflow";
import * as BeTheAnswer from "./posters/BeTheAnswer";
import "../../styles/components/servicePoster.scss";

// Keyed by service slug (services.json). A slug with no poster renders nothing.
const POSTERS = {
  "brand-identity": { n: 1, headline: "In register.", tone: "ink", bg: "cream", ...InRegister },
  "web-development": { n: 2, headline: "Built to convert.", tone: "ink", bg: "mint", ...BuiltToConvert },
  "ai-development": { n: 3, headline: "Always on.", tone: "cream", bg: "ink", ...Workflow },
  "marketing-ads": { n: 4, headline: "Be the answer.", tone: "ink", bg: "terra", ...BeTheAnswer },
};

// The hero frame: this markup IS the static poster (SSR, no JS, reduced
// motion, error fallback). Presentation attributes only, nothing hidden.
const PosterArt = ({ cfg }) => (
  <svg viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
    <cfg.Art />
    <PosterFrame n={cfg.n} headline={cfg.headline} tone={cfg.tone} />
  </svg>
);

function LivePoster({ cfg, cardRef, className, onError }) {
  const wrapRef = useRef(null);
  usePosterEngine({ wrapRef, cardRef, create: cfg.create, onError });
  return (
    <span ref={wrapRef} className={className}>
      <PosterArt cfg={cfg} />
    </span>
  );
}

class PosterBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export default function ServicePoster({ slug, cardRef }) {
  const cfg = POSTERS[slug];
  const [failed, setFailed] = useState(false);
  const onError = useCallback(() => setFailed(true), []);
  if (!cfg) return null;
  const className = `service-poster sp-bg-${cfg.bg}`;
  const still = (
    <span key="static" className={className}>
      <PosterArt cfg={cfg} />
    </span>
  );
  return (
    <PosterBoundary fallback={still}>
      {failed ? still : <LivePoster key="live" cfg={cfg} cardRef={cardRef} className={className} onError={onError} />}
    </PosterBoundary>
  );
}
