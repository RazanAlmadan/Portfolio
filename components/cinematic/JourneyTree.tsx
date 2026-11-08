import Image from 'next/image';
import { cinematicTiming } from '@/data/cinematic';

/** Artwork and interaction anchors share the same 1200 × 1800 coordinate system. */
export default function JourneyTree() {
  return (
    <div className="celestial-tree">
      <Image src="/cinematic/celestial-tree.webp" alt="" fill sizes="(max-width: 700px) 140vw, 1000px" quality={90} className="tree-painting" />
      <svg className="tree-light-map" viewBox="0 0 1200 1800" aria-hidden="true">
        <defs>
          <filter id="branch-bloom"><feGaussianBlur stdDeviation="9" /></filter>
          <linearGradient id="branch-energy" x1="0" y1="1" x2="1" y2="0"><stop stopColor="#9c8bd3" stopOpacity="0"/><stop offset="1" stopColor="#d9faff"/></linearGradient>
        </defs>
        {cinematicTiming.chapters.map((chapter, index) => {
          const x = chapter.point[0] * 1200;
          const y = chapter.point[1] * 1800;
          const d = `M600 ${Math.min(y + 190, 1490)} Q${x + (x < 600 ? 75 : -75)} ${y + 100} ${x} ${y}`;
          return <g key={index} className="branch-energy" data-branch={index}>
            <path d={d} fill="none" stroke="#a6c9ff" strokeWidth="14" opacity=".5" filter="url(#branch-bloom)"/>
            <path className="branch-trace" d={d} fill="none" stroke="url(#branch-energy)" strokeWidth="2" pathLength="1"/>
            <circle cx={x} cy={y} r="35" fill="#beadff" filter="url(#branch-bloom)" opacity=".65"/>
            <circle className="arrival-ring" cx={x} cy={y} r="24" fill="none" stroke="#deedff" strokeWidth="1"/>
            <circle cx={x} cy={y} r="3" fill="#fff"/>
          </g>;
        })}
      </svg>
      <div className="tree-inner-light" />
    </div>
  );
}
