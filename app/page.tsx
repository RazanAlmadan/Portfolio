import JourneyLoader from '@/components/journey/JourneyLoader';
import Portfolio from '@/components/portfolio/Portfolio';

export default function Home() {
  return (
    <main id="main">
      <JourneyLoader />
      <Portfolio />
    </main>
  );
}
