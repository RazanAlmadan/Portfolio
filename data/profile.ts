export const profile: {
  name: string; role: string; location: string; intro: string;
  email?: string; githubUrl?: string; linkedinUrl?: string;
} = {
  name: 'Razan Almadan',
  role: 'Full Stack Developer',
  location: 'Dammam, Saudi Arabia',
  intro:
    'Computer Science graduate focused on Java and Spring Boot, building full-stack applications with AI integration. Below is the detail behind every branch of the tree.',
  email: 'razanalmadn@gmail.com',
  githubUrl: 'https://github.com/RazanAlmadan',
  linkedinUrl: 'https://www.linkedin.com/in/razanalmadan',
};

export const experience = [
  { title: 'Tuwaiq Academy × Misk Skills', meta: 'Web Development Using Java & AI Technologies · 3-month bootcamp · 2026', text: 'Intensive, hands-on training in enterprise Java, Spring Boot, REST APIs, database design, and AI integration. Projects: TasmeemHub (solo capstone), Sahl Darbak (team capstone), the Mergab Expo hackathon, and SANA, the final project.' },
  { title: 'DataAnnotation', meta: 'AI Data Annotator · Remote', text: 'Evaluating and refining dataset inputs used to train and align language models.' },
  { title: 'InterContinental Hotels & Resorts', meta: 'IT Assistant Trainee · Co-op, 2 months', text: 'Infrastructure support, troubleshooting, and hardware and network setup.' },
  { title: 'Imam Abdulrahman Bin Faisal University', meta: 'BSc in Computer Science', text: 'College of Computer Science and Information Technology.' },
];

// `logo` is a key understood by the journey engine (inline simple-icons paths).
export const skills: { group: string; items: { label: string; logo?: string }[] }[] = [
  { group: 'Languages', items: [{ label: 'Java' }, { label: 'Python', logo: 'python' }, { label: 'JavaScript', logo: 'javascript' }, { label: 'C++' }, { label: 'SQL' }] },
  { group: 'Backend', items: [{ label: 'Spring Boot', logo: 'springboot' }, { label: 'Spring Data JPA' }, { label: 'Hibernate' }, { label: 'REST APIs' }] },
  { group: 'Frontend', items: [{ label: 'HTML5' }, { label: 'CSS3' }, { label: 'JavaScript', logo: 'javascript' }, { label: 'React', logo: 'react' }] },
  { group: 'Databases', items: [{ label: 'MySQL', logo: 'mysql' }, { label: 'SQL' }] },
  { group: 'AI', items: [{ label: 'Google Gemini', logo: 'googlegemini' }, { label: 'OpenAI' }, { label: 'YOLOv8', logo: 'ultralytics' }, { label: 'Computer Vision' }, { label: 'Deep Learning' }] },
  { group: 'Tools', items: [
    { label: 'IntelliJ IDEA', logo: 'intellijidea' }, { label: 'VS Code', logo: 'vscode' }, { label: 'WebStorm', logo: 'webstorm' },
    { label: 'Android Studio', logo: 'androidstudio' }, { label: 'NetBeans', logo: 'apachenetbeanside' }, { label: 'Figma', logo: 'figma' },
    { label: 'Postman', logo: 'postman' }, { label: 'Git & GitHub', logo: 'git github' }, { label: 'Roboflow', logo: 'roboflow' },
    { label: 'n8n', logo: 'n8n' }, { label: 'Vast.ai' },
  ] },
];

// Draft: edit freely. Keep it in your own voice.
export const about = {
  title: 'Curious about how things work, and about making them better.',
  paragraphs: [
    "I'm Razan, a Computer Science graduate from Imam Abdulrahman Bin Faisal University, based in Dammam. I work mainly with Java and Spring Boot, building the backend logic and APIs behind real products, and I enjoy shaping the interface people actually touch.",
    'My path moved from learning to building. In a three-month bootcamp at Tuwaiq Academy, in collaboration with Misk Skills, I built TasmeemHub on my own and Sahl Darbak with a team, and joined an Expo hackathon with Mergab. The bootcamp ended with SANA, our final project: an AI-assisted creative workspace we deployed and presented at the final project exhibition.',
    'AI has become a natural part of how I build. I integrate models like Gemini and OpenAI into full-stack applications, with a review step so users stay in control. My graduation project, WasteWise, is where I first trained a computer vision model. Right now I am deepening my full-stack and AI integration skills and looking for opportunities to build real products.',
  ],
  facts: [
    { k: 'Based in', v: 'Dammam, Saudi Arabia' },
    { k: 'Focus', v: 'Java · Spring Boot · Full-stack' },
    { k: 'Also', v: 'AI integration · Gemini, OpenAI' },
    { k: 'Education', v: 'BSc Computer Science, IAU' },
  ],
};
