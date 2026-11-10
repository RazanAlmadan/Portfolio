export type Shot = { src: string; caption: string };
export type ProjectVideo = { src: string; poster: string; caption: string };

export type Project = {
  slug: string;
  name: string;
  category: string;
  summary: string;
  highlights: string[];
  role: string;
  stack: string[];
  stat?: { value: string; label: string };
  repository?: string; // GitHub link
  demo?: string; // live site
  orb: [string, string, string]; // planet colours used for the generated cover and the card glow
  planet?: 'ring' | 'moon';
  shots?: Shot[]; // screenshots in /public/projects; cards rotate through the first few, the project page shows all
  video?: ProjectVideo; // plays on hover on the card, normal player on the project page
};

// Newest first. Full case-study text lives in data/cases.ts.
export const projects: Project[] = [
  {
    slug: 'sana',
    orb: ['#c8fbff', '#3cc4dc', '#124a63'],
    name: 'SANA',
    category: 'AI Creative Workspace · Full-Stack · Team project',
    summary: 'A planning workspace that turns scattered creative ideas into connected, structured project blueprints.',
    highlights: [
      'Interactive canvases with nodes and relations, timelines, characters, and branching stories',
      'Moodboards with AI assistance',
      'AI proposals that need the user\'s review and approval before anything changes',
    ],
    role: 'Frontend and product integration, the AI assistant experience, and Creative Director prompt design in the Creativity domain. A team project: teammates own the other domains.',
    stack: ['React', 'Vite', 'Spring Boot', 'MySQL', 'n8n', 'OpenAI'],
    repository: 'https://github.com/RazanAlmadan/SANA',
    demo: 'https://13-63-96-176.sslip.io/#/home',
    shots: [
      { src: '/projects/sana-home.webp', caption: 'Landing page: every great idea starts with a spark' },
      { src: '/projects/sana-login.webp', caption: 'Sign-in page' },
      { src: '/projects/sana-dashboard.webp', caption: 'Projects dashboard with project templates' },
      { src: '/projects/sana-idea.webp', caption: 'Start with SANA AI: describe an idea and let it propose the first structure' },
      { src: '/projects/sana-relationships.webp', caption: 'Relationship map: story entities connected by typed relations' },
      { src: '/projects/sana-concept-map.webp', caption: 'Education domain: a concept map that breaks a lesson topic into branches, notes and sub-concepts' },
      { src: '/projects/sana-moodboard.webp', caption: 'Moodboard with image discovery and source attribution' },
      { src: '/projects/sana-dialogue.webp', caption: 'Branching dialogue play-through' },
      { src: '/projects/sana-radar.webp', caption: 'Character balance: radar comparison of playable characters' },
      { src: '/projects/sana-usecase.webp', caption: 'Use-case diagram with actors and system boundaries' },
      { src: '/projects/sana-architecture.webp', caption: 'System architecture view: client, services, data and integrations' },
      { src: '/projects/sana-audience.webp', caption: 'Target audience analysis' },
      { src: '/projects/sana-business.webp', caption: 'Business model canvas' },
      { src: '/projects/sana-competitors.webp', caption: 'Competitor analysis' },
    ],
  },
  {
    slug: 'mergab',
    orb: ['#dac8ff', '#8d63e0', '#2f1a63'], planet: 'moon',
    name: 'Mergab',
    category: 'Simulation · Smart Event Management · Expo Hackathon · Team project',
    summary: 'A crowd-management platform for exhibitions that simulates visitor movement and identifies congestion.',
    highlights: [
      'Time-based, event-aware visitor movement simulation',
      'Capacity and bottleneck analysis, baseline versus proposed interventions',
      'Organizers approve changes before any crowd action is applied',
    ],
    role: 'The Java and Spring Boot side, including the event-driven crowd simulation. A teammate built the AI prediction service.',
    stack: ['Java', 'Spring Boot', 'Simulation', 'HTML', 'CSS', 'JavaScript'],
    repository: 'https://github.com/RazanAlmadan/Mergab',
    shots: [
      { src: '/projects/mergab-home.webp', caption: 'Home page (Arabic and English)' },
      { src: '/projects/mergab-map.webp', caption: 'Interactive venue map with live zone occupancy and routing' },
      { src: '/projects/mergab-dashboard.webp', caption: 'Organizer dashboard: zone occupancy and upcoming events' },
      { src: '/projects/mergab-simulation.webp', caption: 'Crowd simulation: visitors moving between zones' },
    ],
  },
  {
    slug: 'sahl-darbak',
    orb: ['#ffd9a8', '#e8883a', '#6a2f12'],
    name: 'Sahl Darbak',
    category: 'AI Travel Planning · Capstone 3 · Team project',
    summary: 'A travel planning platform that combines AI recommendations with real-world data.',
    highlights: [
      'AI destination recommendations and AI packing lists',
      'Weather-aware suggestions (OpenWeather) and public holidays (Nager.Date)',
      'Transport suggestions based on real route data (Geoapify)',
    ],
    role: 'The Discover area: AI destination recommendations and country comparison, weather and holiday data, packing list, transportation, and the travel community with AI moderation.',
    stack: ['Java', 'Spring Boot', 'MySQL', 'Gemini', 'REST APIs', 'HTML', 'CSS', 'JavaScript'],
    repository: 'https://github.com/RazanAlmadan/SahilDarbak',
    video: { src: '/projects/sahl-darbak.mp4', poster: '/projects/sahl-darbak-poster.webp', caption: 'Full walkthrough: trip request, AI destination picks, daily itinerary, budget and traveler matching' },
  },
  {
    slug: 'tasmeemhub',
    orb: ['#ffd3ef', '#d86bb0', '#5a1f52'], planet: 'ring',
    name: 'TasmeemHub',
    category: 'Full-Stack · AI Integration · Capstone 2 · Solo project',
    summary: 'A platform connecting clients with designers, from the first request to the final delivery.',
    highlights: [
      'Designer discovery and portfolios, project requests, client–designer chat',
      'Proposals, written manually or AI-assisted, and AI designer matching',
      'Orders with a 20% and 80% payment workflow, draft review and revisions',
    ],
    role: 'Backend business logic, APIs, workflows, frontend, and AI-related features.',
    stack: ['Java', 'Spring Boot', 'MySQL', 'Thymeleaf', 'REST APIs', 'Gemini', 'HTML', 'CSS', 'JavaScript'],
    repository: 'https://github.com/RazanAlmadan/Capstone-2',
    shots: [
      { src: '/projects/tasmeem-home.webp', caption: 'Landing page' },
      { src: '/projects/tasmeem-ai.webp', caption: 'AI matching: find designers by visual style' },
      { src: '/projects/tasmeem-designers.webp', caption: 'Designer discovery with search and categories' },
    ],
  },
  {
    slug: 'wastewise',
    orb: ['#9ff0d8', '#2fa58f', '#0e3f40'],
    name: 'WasteWise',
    category: 'Computer Vision · Graduation Project · Team project',
    summary: 'A real-time waste detection and classification system powered by YOLOv8, covering plastic, metal, and trash.',
    highlights: [
      'Dataset collection, labeling and preparation',
      'YOLOv8s training, fine-tuning and evaluation',
      'Companion Android camera app built by the team',
    ],
    role: 'The machine-learning side: dataset preparation, model training and fine-tuning, and evaluation. The Android app was built by teammates.',
    stack: ['Python', 'YOLOv8', 'Roboflow', 'Vast.ai'],
    stat: { value: '92.19%', label: 'mAP@50 on the project\'s evaluation' },
    shots: [
      { src: '/projects/wastewise-logo.webp', caption: 'WasteWise brand identity' },
      { src: '/projects/wastewise-app.webp', caption: 'Companion Android app (built by teammates): live camera detection and image import with the trained model' },
    ],
  },
];
