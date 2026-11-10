export type CaseItem = { title: string; text: string };

export type CaseStudy = {
  tagline: string;
  glance: { label: string; value: string }[]; // four short facts under the hero
  overview: string;
  problem: string;
  approach: string;
  flowTitle: string;
  flow: string[]; // ordered steps
  featuresTitle: string;
  features: { title: string; items: string[] }[];
  deepTitle?: string; // optional "under the hood" block
  deep?: CaseItem[];
  result?: { value: string; label: string; text: string; note?: string };
  mineTitle: string;
  mineLead: string;
  mine: CaseItem[]; // what I built
  notMine?: string; // honest note about teammates' work
  challenges: CaseItem[];
  learned: string;
};

// Case-study copy, keyed by project slug. Edit the text here; the page layout is in app/projects/[slug]/page.tsx.
export const cases: Record<string, CaseStudy> = {
  sana: {
    tagline: "Where ideas take shape.",
    glance: [
      {
        label: "Type",
        value: "Team project · Full-stack"
      },
      {
        label: "My focus",
        value: "Creativity domain, frontend, AI assistant"
      },
      {
        label: "Domains",
        value: "Technology · Business · Education · Creativity"
      },
      {
        label: "Status",
        value: "Live on AWS"
      }
    ],
    overview: "SANA (سنا) turns a rough idea into a structured, visual project. You describe what you want to build, write or plan, SANA AI picks the right kind of diagram and draws a first version on a shared canvas, and you refine it from there across four domains: Technology, Business, Education and Creativity.",
    problem: "People with a new idea rarely know where to start: which diagram fits, how to structure it, which tool to use. They end up jumping between separate tools for system design, business analysis, study notes and story planning.",
    approach: "One workspace for every domain, and an AI that proposes instead of overwriting. Each AI change arrives as a proposal the user accepts or rejects, and is checked against the diagram's rules before anything is saved.",
    flowTitle: "From idea to project",
    flow: [
      "Describe an idea",
      "AI picks the domain and diagram",
      "First version drawn on the canvas",
      "Edit by hand or ask the assistant",
      "Review the AI proposal",
      "Accept or reject"
    ],
    featuresTitle: "What the platform covers",
    features: [
      {
        title: "Technology",
        items: [
          "System architecture",
          "ERD",
          "UML class diagram",
          "Use-case diagram"
        ]
      },
      {
        title: "Business",
        items: [
          "Business model canvas",
          "Target audience",
          "SWOT",
          "Competitor and risk analysis"
        ]
      },
      {
        title: "Education",
        items: [
          "Mind maps"
        ]
      },
      {
        title: "Creativity",
        items: [
          "Story maps and timelines",
          "Branching dialogue with play-through",
          "Character balance",
          "Moodboards and book inspiration"
        ]
      }
    ],
    mineTitle: "What I built",
    mineLead: "The Creativity domain on the frontend, the platform-wide interface, and the AI assistant experience.",
    mine: [
      {
        title: "Story maps",
        text: "A connected graph of characters, locations, world rules and events, with custom node styles, zoom, pan and layout tools so large stories stay readable."
      },
      {
        title: "Story timeline",
        text: "Events can be read in chronological order or in the order they are revealed, with expandable details that link back to the story node."
      },
      {
        title: "Branching dialogue",
        text: "Scenes and choices on a visual tree, automatic arrangement, a play-through preview and Yarn export."
      },
      {
        title: "Character balance",
        text: "Playable characters with 0 to 10 attributes, radar-chart comparison, and AI balance suggestions shown as drafts to review."
      },
      {
        title: "Moodboards",
        text: "Image search across the Cleveland Museum of Art, The Met, Wikimedia Commons and Pixabay with attribution, notes, AI suggestions with approve or reject, and print to PDF."
      },
      {
        title: "Book inspiration",
        text: "Real books from Open Library with AI recommendations that explain how each one relates to the story."
      },
      {
        title: "Platform frontend",
        text: "Landing page, login, dashboards, the shared canvas, the SANA AI assistant panel with proposal review, and the visual identity: deep teal, cream and gold."
      },
      {
        title: "AI assistant and prompts",
        text: "Wrote and refined the Creative Director prompts inside the team's n8n workflows, and built the interface side of AI requests: status checks, proposal preview, and accept or reject."
      }
    ],
    notMine: "SANA is a team project. Backend logic for the other domains, billing and deployment are team work, and the n8n workflows are shared with the team.",
    challenges: [
      {
        title: "Making dense graphs readable",
        text: "Story graphs grow fast. Node sizing, layout and navigation had to keep relationships understandable at scale."
      },
      {
        title: "Two kinds of time in a story",
        text: "Events happen in one order and are told in another, so the timeline supports both views."
      },
      {
        title: "AI without losing control",
        text: "Requests run asynchronously (pending, running, completed, failed, timed out) and every result is a reviewable proposal."
      },
      {
        title: "One canvas, many domains",
        text: "Each domain has its own node types and rules, yet they all live in the same canvas and navigation."
      }
    ],
    learned: "AI works best in a creative tool when it behaves like a collaborator with a review step, not an automation. This project also taught me how to carry a large API surface into a complex, interactive React interface."
  },
  mergab: {
    tagline: "Predict the crowd. Simulate the response.",
    glance: [
      {
        label: "Type",
        value: "Team project · Expo 2030 Challenge"
      },
      {
        label: "Team",
        value: "OMINX, four developers"
      },
      {
        label: "My focus",
        value: "Java and Spring Boot simulation"
      },
      {
        label: "Status",
        value: "Functional prototype"
      }
    ],
    overview: "Mergab (مرقاب) is a crowd-management prototype for the visitor experience at Expo Riyadh 2030. It brings crowd visibility, operational simulation and visitor navigation into one system, so organizers can anticipate congestion instead of reacting to it.",
    problem: "Around a popular event or a busy entrance, crowds build up and spread between connected zones before operators can respond. Looking at today's head count does not show what is about to happen.",
    approach: "Model the venue as connected zones with capacities, simulate movement minute by minute, add event demand and prayer-time flow, then forecast congestion. Organizers review and decide before any crowd action is applied.",
    flowTitle: "How the system works",
    flow: [
      "Zones, paths, events and attendance",
      "Spring Boot platform",
      "Minute-by-minute crowd simulation",
      "Occupancy and queue snapshots",
      "Prediction service (Python)",
      "Congestion levels and early warnings"
    ],
    featuresTitle: "What it offers",
    features: [
      {
        title: "For organizers",
        items: [
          "Operations dashboard with zone occupancy",
          "Zone, path and event management",
          "Simulation scenarios and early warnings",
          "Interventions, reports and CSV export"
        ]
      },
      {
        title: "For visitors",
        items: [
          "Interactive venue map",
          "Event discovery and facilities",
          "Congestion-aware route suggestions",
          "QR check-in, prayer times, Arabic and English"
        ]
      },
      {
        title: "Platform",
        items: [
          "Admin, organizer and visitor roles",
          "Spring Security with BCrypt",
          "Email registration and password recovery"
        ]
      }
    ],
    deepTitle: "Inside the simulation",
    deep: [
      {
        title: "Event-driven arrivals",
        text: "Each event's expected attendance is spread over a configurable window before it starts."
      },
      {
        title: "Shared corridor capacity",
        text: "Ordinary visitor flow, event cohorts and prayer cohorts draw from the same per-minute corridor budget, so throughput is never counted twice."
      },
      {
        title: "Prayer-aware movement",
        text: "Prayer times drive their own movement cohort across the venue."
      },
      {
        title: "Historical demand scaling",
        text: "Attendance patterns from Expo Osaka scale the expected demand."
      },
      {
        title: "Validated and tested",
        text: "Inputs are checked before every run so impossible values cannot corrupt later minutes, and nine JUnit test classes cover movement, routing, events and prayers."
      }
    ],
    mineTitle: "What I built",
    mineLead: "The Java and Spring Boot side of the system, focused on the event-driven crowd simulation.",
    mine: [
      {
        title: "Crowd simulation",
        text: "Time-based visitor movement between connected, capacity-limited zones, with queues and occupancy snapshots."
      },
      {
        title: "Event-aware behavior",
        text: "Scheduled events change where and when visitors move."
      },
      {
        title: "Spring Boot services",
        text: "Application logic and REST APIs that let the dashboards and the prediction service use simulation results."
      }
    ],
    notMine: "The Python prediction service and the trained models were built by teammates, as were other parts of the interface.",
    challenges: [
      {
        title: "Modeling a changing venue",
        text: "Movement depends on time, destinations, events and how full each zone already is."
      },
      {
        title: "Respecting capacity",
        text: "Corridors have limits. Splitting one capacity budget fairly among competing groups took careful design."
      },
      {
        title: "Keeping results trustworthy",
        text: "Validation and tests were needed so a bad input could not silently ruin an entire run."
      },
      {
        title: "Working with a separate AI service",
        text: "The simulation had to produce clean snapshots the prediction service could consume."
      }
    ],
    learned: "Mergab pushed me beyond CRUD into systems with changing state, shared limits and time. It also showed me how much a clear contract between components matters in a team."
  },
  "sahl-darbak": {
    tagline: "Plan smarter, travel together.",
    glance: [
      {
        label: "Type",
        value: "Team project · Capstone 3"
      },
      {
        label: "Team",
        value: "Three developers"
      },
      {
        label: "My area",
        value: "Discover"
      },
      {
        label: "Stack",
        value: "Spring Boot · Gemini · 3 external APIs"
      }
    ],
    overview: "SahlDarbak (سهل دربك) is a travel-planning and traveler-matching platform. It helps people discover destinations, build single-city or multi-city trips, generate itineraries, prepare for travel and connect with other travelers. It assists with planning and does not handle bookings or payments.",
    problem: "Planning a trip means juggling destinations, weather, holidays, transport and budget across many websites. The result is slow, fragmented and hard to personalize.",
    approach: "Combine each traveler's preferences with AI and live data from external services, so recommendations reflect real conditions such as weather and public holidays.",
    flowTitle: "The discovery journey",
    flow: [
      "Travel request and preferences",
      "AI destination recommendations",
      "Compare two countries",
      "Select a destination",
      "Trip is created",
      "Weather, holidays, packing list and transport"
    ],
    featuresTitle: "The three areas of the team",
    features: [
      {
        title: "Discover (mine)",
        items: [
          "AI destination recommendations",
          "Country comparison",
          "Trip creation, weather and holidays",
          "Packing list, transport and community"
        ]
      },
      {
        title: "Plan",
        items: [
          "Single and multi-city planning",
          "Smart daily itineraries",
          "Budget estimation"
        ]
      },
      {
        title: "Explore",
        items: [
          "Location-based city guide",
          "Traveler matching, invitations and chat"
        ]
      }
    ],
    mineTitle: "What I built",
    mineLead: "The Discover area: AI recommendations backed by real data, then everything needed to prepare a trip.",
    mine: [
      {
        title: "AI destination recommendations",
        text: "Country suggestions from the traveler's preferences, restrictions, dates and budget, enriched with OpenWeather and Nager.Date data."
      },
      {
        title: "Country comparison",
        text: "Two destinations compared on weather, activities, environment, crowds and budget, with a reasoned recommendation."
      },
      {
        title: "Select destination and create trip",
        text: "Connects the recommendation stage to the real trip workflow."
      },
      {
        title: "Weather and public holidays",
        text: "Live weather and holiday information for the chosen destination and travel dates."
      },
      {
        title: "AI packing list",
        text: "A categorized list based on the destination, weather and planned activities."
      },
      {
        title: "AI transportation",
        text: "Geoapify route data analyzed by Gemini to recommend walking or public transport between places, with an option to email it."
      },
      {
        title: "Travel community",
        text: "Posts, search by country and rating-based discovery, with an AI moderator that reviews content before it is published."
      }
    ],
    notMine: "SahlDarbak is a team project. Itinerary generation, multi-city planning, budgeting, the city guide and traveler matching belong to my teammates.",
    challenges: [
      {
        title: "Grounding AI in real data",
        text: "Recommendations had to reflect live weather and holiday data, not only what the model knew."
      },
      {
        title: "Different API formats",
        text: "Each service returns a different shape, so the backend normalizes them before combining."
      },
      {
        title: "Structured, reliable AI output",
        text: "Responses are requested as structured JSON so endpoints can process them safely, and slow AI calls had to be planned for."
      },
      {
        title: "Moderating user content",
        text: "Community posts are reviewed by AI before publishing."
      }
    ],
    learned: "I learned how to wrap generative AI in a structured backend: feed it real data, constrain its output, and treat latency as a design input."
  },
  tasmeemhub: {
    tagline: "Design work, organized.",
    glance: [
      {
        label: "Type",
        value: "Solo project · Capstone 2"
      },
      {
        label: "My role",
        value: "Everything: backend, frontend, AI"
      },
      {
        label: "Roles",
        value: "Client · Designer"
      },
      {
        label: "Stack",
        value: "Spring Boot · Thymeleaf · MySQL · Gemini"
      }
    ],
    overview: "TasmeemHub is a Saudi design marketplace that connects clients with designers and carries the project from the first request to the final delivery. I built it alone as my second capstone at Tuwaiq Academy.",
    problem: "Creative work gets scattered across chats, files and transfers. Requests, prices, deadlines, drafts, revisions and payments become hard to track for both sides.",
    approach: "One workflow with explicit states, a dedicated experience for each role, and AI features that assist while the final decisions stay with the users.",
    flowTitle: "The project workflow",
    flow: [
      "Find a designer",
      "Send a request",
      "Designer accepts",
      "Chat",
      "Proposal",
      "Client accepts",
      "Order and bill",
      "20% down payment",
      "Work in progress",
      "Draft submitted",
      "Client reviews",
      "Accept: 80% payment and done, or reject: revision"
    ],
    featuresTitle: "What each role can do",
    features: [
      {
        title: "Clients",
        items: [
          "Browse designers and portfolios",
          "Find designers by image style with AI",
          "Send requests, chat, review proposals",
          "Track orders, review drafts, pay"
        ]
      },
      {
        title: "Designers",
        items: [
          "Manage profile and catalog",
          "Handle requests and chat",
          "Write proposals manually or with AI",
          "Submit drafts and revisions, get deadline reminders"
        ]
      },
      {
        title: "Platform",
        items: [
          "Session-based login for two roles",
          "Ratings",
          "Emails for new requests, drafts and deadlines"
        ]
      }
    ],
    deepTitle: "How the AI features work",
    deep: [
      {
        title: "Find designers by image style",
        text: "The client uploads a reference image. Gemini vision describes its visual style, and designers are ranked by how closely their catalog styles match. Each designer's style description is generated once and cached, so repeated searches stay fast."
      },
      {
        title: "AI-assisted proposals",
        text: "Gemini reads the client and designer conversation and drafts a proposal with the agreed requirements, price and deadline. The designer reviews and edits it before sending."
      },
      {
        title: "Deadline reminders",
        text: "A daily scheduled job emails the designer when an order reaches its deadline with no draft submitted."
      }
    ],
    mineTitle: "What I built",
    mineLead: "The whole application, end to end.",
    mine: [
      {
        title: "Backend",
        text: "Spring Boot REST APIs across eleven entities, from designers and catalogs to requests, chats, proposals, orders and bills."
      },
      {
        title: "Workflow logic",
        text: "Order and bill states that enforce the rules, for example that work cannot start before the down payment."
      },
      {
        title: "Frontend",
        text: "Thymeleaf pages with HTML, CSS and JavaScript for landing, dashboards, designers, catalogs and AI search."
      },
      {
        title: "AI features",
        text: "Image-style designer search and AI-assisted proposal generation with Gemini."
      },
      {
        title: "Notifications",
        text: "Email notifications and the daily deadline job."
      }
    ],
    challenges: [
      {
        title: "Many states that depend on each other",
        text: "Requests, chats, proposals, orders, drafts and bills all move together, so every transition had to be guarded."
      },
      {
        title: "Two roles, shared data",
        text: "Clients and designers see the same project through different actions and permissions."
      },
      {
        title: "Turning conversation into a proposal",
        text: "The prompt had to extract requirements, price and deadline from free-form chat."
      },
      {
        title: "Style matching without heavy infrastructure",
        text: "Describing and caching styles made visual search practical."
      }
    ],
    learned: "Building every layer myself taught me to translate business rules into entities, endpoints and screens, and to keep a long workflow consistent from start to finish. Payments are modeled as a bill workflow, with no payment gateway."
  },
  wastewise: {
    tagline: "Smarter waste detection through AI.",
    glance: [
      {
        label: "Type",
        value: "Graduation project · Team"
      },
      {
        label: "My focus",
        value: "Dataset and model"
      },
      {
        label: "Model",
        value: "YOLOv8s"
      },
      {
        label: "Result",
        value: "92.19% mAP@50"
      }
    ],
    overview: "WasteWise is my Computer Science graduation project: a real-time system that detects waste and classifies it as plastic, metal or trash. A custom-trained YOLOv8s model does the detection, and an Android app built by my teammates uses it with the camera or imported images.",
    problem: "Waste comes in every shape, lighting condition and background. A model has to recognize the same material across all of them, and a strong training score is not the same as working well in real use.",
    approach: "Build a custom dataset, augment it for variety, train YOLOv8s, fine-tune, and evaluate with detection metrics before handing the model to the application.",
    flowTitle: "The model pipeline",
    flow: [
      "Collect and label images",
      "Augment the dataset",
      "Train YOLOv8s",
      "Fine-tune",
      "Evaluate",
      "Use in the Android app"
    ],
    featuresTitle: "What the system does",
    features: [
      {
        title: "Detection",
        items: [
          "Three classes: plastic, metal, trash",
          "Bounding boxes with class labels",
          "Confidence score for each detection"
        ]
      },
      {
        title: "Application",
        items: [
          "Live camera detection",
          "Import and analyze an image",
          "Built by teammates"
        ]
      }
    ],
    result: {
      value: "92.19%",
      label: "mAP@50",
      text: "The fine-tuned YOLOv8s model in the project's evaluation. This is an object-detection metric, not classification accuracy.",
      note: "Accepted at two conferences: WiDS and UCB 2025."
    },
    mineTitle: "What I built",
    mineLead: "The machine-learning side of the project.",
    mine: [
      {
        title: "Dataset",
        text: "Collected, labeled and prepared the images in Roboflow for the three waste classes."
      },
      {
        title: "Augmentation",
        text: "Resizing, flipping, rotation and visual changes to help the model handle different conditions."
      },
      {
        title: "Training and fine-tuning",
        text: "YOLOv8s training on a rented Vast.ai GPU, followed by a fine-tuning phase."
      },
      {
        title: "Evaluation",
        text: "Precision, recall and mAP to measure and improve detection quality."
      }
    ],
    notMine: "The Android application was built by teammates. I did not work on it.",
    challenges: [
      {
        title: "Dataset quality and variety",
        text: "The model needed enough representative examples of each material under different conditions."
      },
      {
        title: "Improving detection",
        text: "Training settings and fine-tuning were tuned across several rounds."
      },
      {
        title: "Taking the model to mobile",
        text: "Converting the trained model to TensorFlow Lite produced inconsistent class predictions on the phone. Finding the cause meant investigating the inference pipeline and comparing other routes, such as ncnn and hosted inference."
      },
      {
        title: "Reading the metric correctly",
        text: "mAP@50 measures object detection quality. It is not overall classification accuracy."
      }
    ],
    learned: "A good training metric is only the start. The data, the way the model is used, and the final experience all decide whether an AI system actually works."
  }
};
