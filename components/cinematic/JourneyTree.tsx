import Image from 'next/image';
import { cinematicTiming } from '@/data/cinematic';

/** The painting and story markers share a single proportional coordinate space. */
export default function JourneyTree() {
  return (
    <div className="cin-tree-art" aria-hidden="true">
      <Image
        src="/cinematic/celestial-tree.webp"
        alt=""
        fill
        priority
        quality={78}
        sizes="(max-width: 800px) 95vw, (max-width: 1400px) 58vw, 760px"
        className="cin-tree-painting"
      />
      <div className="cin-tree-luminosity" />
      {cinematicTiming.chapters.map((chapter, index) => (
        <span
          key={index}
          className="cin-tree-marker"
          data-marker={index}
          style={{ left: `${chapter.point[0] * 100}%`, top: `${chapter.point[1] * 100}%` }}
        >
          <span className="cin-tree-marker-ring" />
          <span className="cin-tree-marker-core" />
        </span>
      ))}
    </div>
  );
}
