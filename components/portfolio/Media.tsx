import type { CSSProperties } from 'react';
import type { Project } from '@/data/projects';
import Slideshow from './Slideshow';
import HoverVideo from './HoverVideo';

const CARD_SHOTS = 5; // cards rotate through the first few screenshots; the project page shows them all

// Card cover: video (plays on hover), rotating screenshots, or a generated "planet" when there is no media yet.
export default function Media({ project, order = 0 }: { project: Project; order?: number }) {
  if (project.video) return <HoverVideo video={project.video} name={project.name} />;
  if (project.shots?.length) return <Slideshow shots={project.shots.slice(0, CARD_SHOTS)} name={project.name} order={order} />;
  const [o1, o2, o3] = project.orb;
  const style = { '--o1': o1, '--o2': o2, '--o3': o3 } as CSSProperties;
  return (
    <div className={`media cover${project.planet ? ` cover-${project.planet}` : ''}`} style={style}>
      <i className="orb" aria-hidden="true" />
      <em>Screenshots and demo video coming soon</em>
    </div>
  );
}
