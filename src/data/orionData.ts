import type { ProblemStatement, FAQItem, PatronProfile, OfficeBearer, TimelinePhase, RegisteredTeam, StarNodeData } from '../types/orion';

export const EVENT_METRICS = {
  prizePool: "₹1,00,000",
  round1Fee: "₹100",
  round1FeeLabel: "Flat per team",
  finalistFee: "₹200",
  finalistFeeLabel: "Per head (Top 70 finalists)",
  teamSize: "2–6",
  teamSizeLabel: "Members per team",
  finalistCount: "TOP 70",
  finalistCountLabel: "Teams to Offline Finale",
  deadlineDate: "August 28, 2026",
  deadlineIso: "2026-08-28T23:59:59+05:30",
  duration: "24-Hour Offline Sprint",
  venue: "Sathyabama Institute of Science and Technology, Chennai",
  organizer: "Microsoft Club SIST",
  participation: "Students & Working Professionals",
  googleMapsUrl: "https://maps.google.com/?q=Sathyabama+Institute+of+Science+and+Technology+Chennai"
};

export const PRIZE_TIERS = [
  {
    rank: "1st Place",
    label: "CHAMPION / MISSION ALPHA",
    amount: "₹25,000",
    badge: "GRAND WINNER",
    accent: "from-cyan-400 via-teal-300 to-blue-500",
    border: "border-cyan-400/50",
    glow: "glow-cyan",
    perks: [
      "₹25,000 Cash Grant",
      "Direct Microsoft Mentor Network Access",
      "Grand Champion Aerospace Trophy",
      "Physical Certificate of Excellence",
      "Featured Club Showcase"
    ]
  },
  {
    rank: "1st Runner-Up",
    label: "MISSION BETA",
    amount: "₹15,000",
    badge: "1ST RUNNER-UP",
    accent: "from-purple-400 via-indigo-300 to-violet-500",
    border: "border-purple-400/50",
    glow: "glow-violet",
    perks: [
      "₹15,000 Cash Grant",
      "Ecosystem Cloud Credits & Perks",
      "Runner-Up Aerospace Trophy",
      "Physical Certificate of Merit",
      "Incubation Guidance"
    ]
  },
  {
    rank: "2nd Runner-Up",
    label: "MISSION GAMMA",
    amount: "₹10,000",
    badge: "2ND RUNNER-UP",
    accent: "from-amber-400 via-yellow-300 to-orange-500",
    border: "border-amber-400/50",
    glow: "glow-amber",
    perks: [
      "₹10,000 Cash Grant",
      "Ecosystem Swag & Mentorship",
      "Aerospace Trophy",
      "Physical Certificate of Merit"
    ]
  }
];

export const SPECIAL_TRACK_BOUNTIES = [
  {
    title: "Best AI Innovation",
    icon: "Cpu",
    description: "Breakthrough multi-modal, agentic or generative AI pipeline with high technical complexity.",
    reward: "Track Bounty + Recognition"
  },
  {
    title: "Best UI/UX Experience",
    icon: "Layout",
    description: "Exceptional cybernetic design, spatial clarity, accessibility and seamless user experience.",
    reward: "Track Bounty + Recognition"
  },
  {
    title: "Best Hardware Prototype",
    icon: "HardDrive",
    description: "Innovative IoT / embedded systems / robotics integration solving real-world physical challenges.",
    reward: "Track Bounty + Recognition"
  },
  {
    title: "Best Pitch & Architecture",
    icon: "Presentation",
    description: "Crisp technical defense, bulletproof system architecture, and clear commercial feasibility.",
    reward: "Track Bounty + Recognition"
  }
];

export const PROBLEM_STATEMENTS: ProblemStatement[] = [
  {
    id: "floatchat",
    code: "ORION-PS-01",
    title: "FLOATCHAT",
    tagline: "Multi-Modal Semantic Query Engine & 4D Visualization for ARGO Oceanographic Data",
    domain: "Ocean Informatics • Geospatial AI • 4D Visualization",
    accentColor: "cyan",
    visualTheme: "Deep Ocean Trench • Hydrothermal Holographics • ARGO Float Telemetry",
    overview: "Global ocean climate monitoring relies on thousands of autonomous robotic ARGO profiling floats drifting through ocean depths, sampling salinity, temperature, and geochemical variables from surface to 2,000m depth. FloatChat challenges builders to design an intelligent natural-language query interface and spat-temporal 4D WebGL visualization pipeline that allows marine scientists, oceanographers, and policy analysts to query, cross-correlate, and forecast marine anomalies using multi-modal LLMs.",
    keyFeatures: [
      "Natural Language to Geospatial/Temporal NetCDF Queries",
      "Interactive 4D Spatio-Temporal WebGL Trajectory Renderer",
      "Thermocline & Salinity Gradient Depth-Profile Cross-Sections",
      "Automated Marine Heatwave & Ocean Anomaly Detection"
    ],
    techStack: ["Next.js / React Three Fiber", "Python / FastFloat Engine", "ARGO NetCDF API", "Vector RAG (Chroma/Weaviate)", "Shader Material Trajectories"],
    deliverables: [
      "Interactive WebGL 4D marine data exploration portal",
      "Natural-language query engine with NetCDF multi-variable parsing",
      "Architecture diagram demonstrating low-latency spatio-temporal retrieval",
      "Demonstration of real ARGO profiling float telemetry ingestion"
    ],
    datasetSources: ["Global ARGO Data Repository (GDAC)", "Copernicus Marine Environment Service", "NOAA Ocean Climate Telemetry"],
    evaluationFocus: ["Query accuracy & RAG grounding", "Rendering performance of 100k+ coordinate points", "Scientific utility & intuitive UX", "Latency under multi-parameter filtering"],
    classificationLevel: "CLASSIFIED MISSION — OPEN TO ROUND 1"
  },
  {
    id: "lexvault",
    code: "ORION-PS-02",
    title: "LEXVAULT",
    tagline: "Zero-Knowledge, Blockchain-Powered eVault for Legal & Evidentiary Chains of Custody",
    domain: "Applied Cryptography • Zero-Knowledge Proofs • LegalTech",
    accentColor: "violet",
    visualTheme: "Cryptographic Vault • Immutable Blocks • ZK-SNARK Verification Mesh",
    overview: "Legal and digital forensic evidence must endure strict cryptographic scrutiny without leaking confidential client data or violating data privacy mandates during discovery. LexVault challenges engineers to architect a decentralized, tamper-evident digital evidence depository that uses Zero-Knowledge Proofs (ZK-SNARKs/STARKs) and verifiable ledger anchoring to prove forensic provenance, hash integrity, and chain of custody timelines without disclosing underlying evidentiary content.",
    keyFeatures: [
      "Zero-Knowledge Proof Generation for Document Authenticity",
      "Immutable Cryptographic Chain of Custody Audit Ledger",
      "Multi-Signature Role-Based Discovery Access Controls",
      "Tamper-Evident SHA-256 / Merkle Tree Forensic Verification"
    ],
    techStack: ["Circom / SnarkJS / Noir", "Solidity / Polygon / Arbitrum", "IPFS / Arweave Decentralized Storage", "TypeScript / Web Cryptography API", "Audit HUD"],
    deliverables: [
      "Zero-Knowledge proof generation and verification circuit demo",
      "Decentralized evidence vault interface with timestamped provenance",
      "Verifiable forensic custody logs with cryptographic signatures",
      "Technical architecture documentation with threat model analysis"
    ],
    datasetSources: ["Synthetic Legal Discovery Mock Corpus", "Forensic Disk Image EnCase Hashes", "NIST Computer Forensics Tool Testing"],
    evaluationFocus: ["Cryptographic soundness & zero-leakage guarantee", "Gas/Compute efficiency of proof verification", "Audit trail immutability", "Enterprise-grade legal usability"],
    classificationLevel: "CLASSIFIED MISSION — OPEN TO ROUND 1"
  },
  {
    id: "sylvasense",
    code: "ORION-PS-03",
    title: "SYLVASENSE",
    tagline: "Automated Tree Enumeration & Aboveground Biomass Estimation from Multi-Spectral & SAR Satellite Imagery",
    domain: "Earth Observation • Computer Vision • Climate Tech",
    accentColor: "emerald",
    visualTheme: "Canopy LiDAR Radar • Multi-Spectral SAR • High-Resolution Bio-Telemetry",
    overview: "Verifiable carbon offset verification and biodiversity preservation require high-resolution, scalable canopy density auditing. SylvaSense tasks builders with constructing an end-to-end computer vision and remote-sensing pipeline that merges optical Sentinel-2 / Landsat imagery with Synthetic Aperture Radar (SAR) Sentinel-1 and LiDAR datasets to accurately enumerate individual tree canopies, classify forest biomes, and estimate Aboveground Biomass (AGB) and carbon sequestration metrics.",
    keyFeatures: [
      "Multi-Spectral Optical + Synthetic Aperture Radar (SAR) Data Fusion",
      "High-Resolution Canopy Instance Segmentation & Counting",
      "Aboveground Biomass (AGB) Regression & Carbon Metric Forecasting",
      "Deforestation Alerting & Temporal Canopy Degradation Heatmaps"
    ],
    techStack: ["PyTorch / YOLOv8-OBB / Mask2Former", "Google Earth Engine API / Sentinel Hub", "GeoTIFF Rasterio / GDAL", "Mapbox GL JS / Deck.gl", "FastAPI Inference Backend"],
    deliverables: [
      "Canopy segmentation model pipeline with GeoJSON boundary export",
      "Interactive map dashboard with multi-layer spectral band toggles",
      "Biomass estimation mathematical formulation & validation report",
      "Live raster inference demo on target forest polygon coordinates"
    ],
    datasetSources: ["ESA Sentinel-1/Sentinel-2 Open Access Hub", "NASA GEDI Spaceborne LiDAR Canopy Height Data", "Neon Forest Structural Survey Open Datasets"],
    evaluationFocus: ["Canopy instance segmentation precision (mAP/IoU)", "Biomass estimation mathematical validity", "Data fusion robustness across cloudy terrain", "Scale & inferencing throughput"],
    classificationLevel: "CLASSIFIED MISSION — OPEN TO ROUND 1"
  }
];

export const PPT_TEMPLATE_RULES = [
  {
    rule: "No slides may be added",
    description: "The template slide count is fixed. Adding additional slides results in disqualification.",
    icon: "FileMinus"
  },
  {
    rule: "No slides may be removed",
    description: "Every section from problem analysis to tech architecture must be addressed.",
    icon: "FileX"
  },
  {
    rule: "No slides may be reordered",
    description: "Maintain the standardized evaluation sequence for jury screening consistency.",
    icon: "ArrowUpDown"
  },
  {
    rule: "Template must be used exactly",
    description: "Only official placeholders, text frames, and diagrams may be modified.",
    icon: "CheckSquare"
  },
  {
    rule: "Preserve branding & headers",
    description: "Do not alter ORION 1.0 official header/footer metadata or sponsor lockups.",
    icon: "ShieldAlert"
  },
  {
    rule: "Strict File Naming Protocol",
    description: "Submissions must be strictly formatted as: TeamName_ORION1.0 (PPTX or PDF).",
    icon: "FileCode"
  }
];

export const HOSPITALITY_SYSTEMS = [
  {
    icon: "Coffee",
    title: "2 BREAKFASTS",
    subtitle: "Both hack days covered",
    detail: "Nutritious morning spreads to power intense ideation sprints."
  },
  {
    icon: "Utensils",
    title: "2 LUNCHES",
    subtitle: "Both hack days covered",
    detail: "Full multi-cuisine meals provided inside the air-conditioned campus arena."
  },
  {
    icon: "Moon",
    title: "1 GRAND DINNER",
    subtitle: "Plus midnight energy packs",
    detail: "Hot dinner served along with midnight caffeine, snacks, and booster kits."
  },
  {
    icon: "Shirt",
    title: "OFFICIAL SWAG KIT",
    subtitle: "Tees, stickers & badges",
    detail: "Custom ORION 1.0 commemorative tees, mission badges, stickers and lanyard."
  },
  {
    icon: "Zap",
    title: "24/7 POWER & HIGH-SPEED WIFI",
    subtitle: "Dedicated hacking arena",
    detail: "Uninterrupted power back-up, dedicated LAN/Wi-Fi mesh, and dual monitor stations."
  },
  {
    icon: "Home",
    title: "FREE ACCOMMODATION",
    subtitle: "For out-of-Chennai finalist teams",
    detail: "Clean on-campus hostel lodging for confirmed finalists traveling to Chennai."
  },
  {
    icon: "Flame",
    title: "LIVE PROBLEM STATEMENTS",
    subtitle: "Revealed on-spot at Finale",
    detail: "Exclusive 24-hour sprint challenges and mentor masterclasses during the Grand Finale."
  }
];

export const TIMELINE_PHASES: TimelinePhase[] = [
  {
    number: "01",
    title: "MISSION REGISTRATIONS & OPEN INNOVATION",
    subtitle: "Round 1 Online Launchpad",
    date: "Active Now — Closes Aug 28, 2026",
    status: "active",
    highlights: [
      "Flat ₹100 registration fee per team (2–6 members)",
      "Choose from 3 Flagship Problem Statements OR Open Innovation tracks (AI, Web3, Systems, Cloud, Healthcare, Hardware)",
      "Prepare and upload mandatory standardized PPT / PDF submission"
    ]
  },
  {
    number: "02",
    title: "ONLINE SCREENING & EVALUATION",
    subtitle: "Rigorous Technical Filter",
    date: "August 29 – September 02, 2026",
    status: "upcoming",
    highlights: [
      "Jury review across Innovation, Feasibility, Technical Depth & Impact",
      "Plagiarism, template compliance, and architectural soundness validation",
      "Shortlisting matrix computed for pan-India participants"
    ]
  },
  {
    number: "03",
    title: "THE CUT — TOP 70 FINALISTS ANNOUNCED",
    subtitle: "Elite Shortlist Notification",
    date: "September 03, 2026",
    status: "upcoming",
    highlights: [
      "Official publication of Top 70 Finalist Teams",
      "Direct Discord / Email dispatch with invitation credentials",
      "Issuance of Digital Finalist Credential Badges"
    ]
  },
  {
    number: "04",
    title: "PHASE 2 CONFIRMATION & LOGISTICS LOCK",
    subtitle: "Finalist Slot Confirmation",
    date: "September 04 – September 10, 2026",
    status: "upcoming",
    highlights: [
      "₹200 per head finalist confirmation fee",
      "Locks in 2 Breakfasts, 2 Lunches, 1 Dinner, Swag Kits & Arena access",
      "Free campus hostel accommodation booking for outstation teams"
    ]
  },
  {
    number: "05",
    title: "24H OFFLINE GRAND FINALE",
    subtitle: "The Final Frontier at SIST Chennai",
    date: "September 2026 • Sathyabama Campus",
    status: "upcoming",
    highlights: [
      "24-hour continuous coding sprint in dedicated mission arena",
      "Live on-the-spot problem twists and mentor checkpoints",
      "Grand jury defense on stage & ₹1,00,000 prize distribution"
    ]
  }
];

export const FAQ_DATA: FAQItem[] = [
  {
    category: "General",
    question: "Who is eligible to participate in ORION 1.0?",
    answer: "ORION 1.0 is open to all college students (undergraduate, postgraduate, PhD) and early-career working professionals across India. Cross-institutional teams are enthusiastically welcome!"
  },
  {
    category: "Fees & Teams",
    question: "How does the two-tier fee structure work?",
    answer: "Round 1 is a low-barrier online qualifier with a flat registration fee of ₹100 per team (regardless of 2 or 6 members). Only teams shortlisted in the Top 70 for the offline Grand Finale pay the ₹200 per head finalist confirmation fee, which covers 2 days of meals, official swag kits, 24/7 venue access, and free accommodation for outstation teams."
  },
  {
    category: "Fees & Teams",
    question: "What are the exact team size rules?",
    answer: "Teams must consist of a minimum of 2 members and a maximum of 6 members. Individual solo participation is not permitted to encourage collaborative aerospace engineering mindset."
  },
  {
    category: "Submissions",
    question: "What do we build and submit in Round 1?",
    answer: "In Round 1, teams must submit their problem analysis, system architecture, tech stack justification, and project roadmap using the official mandatory ORION 1.0 PPT template (exported as PPTX or PDF). Demo videos or prototype repository links can be included within the designated slide placeholders."
  },
  {
    category: "Submissions",
    question: "Can we modify the slide count of the PPT template?",
    answer: "No. Strict rule: No slides may be added, removed, or reordered. Branding, headers, and footers must remain intact. Only fill the provided content placeholders. File name must be: TeamName_ORION1.0."
  },
  {
    category: "Finale & Logistics",
    question: "How are the Grand Finale problem statements distributed?",
    answer: "While teams can continue building their Round 1 solution, live problem twists and dynamic constraints will be revealed on-the-spot at the start of the 24-hour offline sprint at SIST Chennai."
  },
  {
    category: "Finale & Logistics",
    question: "How and when are the prizes distributed?",
    answer: "The total prize pool of ₹1,00,000 (including ₹25k 1st Place, ₹15k 1st Runner-Up, ₹10k 2nd Runner-Up, and Special Track Bounties) along with Certificates of Merit and trophies will be awarded physically during the Valedictory Ceremony immediately concluding the 24-hour sprint."
  },
  {
    category: "Finale & Logistics",
    question: "What about meals, accommodation, and travel logistics?",
    answer: "All confirmed finalist teams receive 2 Breakfasts, 2 Lunches, 1 Dinner, and midnight booster packs. Free hostel accommodation on the Sathyabama campus is provided for teams traveling from outside Chennai. Participants manage their own travel to Chennai."
  }
];

export const CHIEF_PATRONS: PatronProfile[] = [
  {
    name: "Dr. Mariazeena Johnson",
    title: "Chancellor",
    organization: "Sathyabama Institute of Science and Technology",
    roleType: "Chief Patron",
    initials: "MJ",
    avatarColor: "from-cyan-500 to-blue-700"
  },
  {
    name: "Dr. Marie Johnson",
    title: "President",
    organization: "Sathyabama Institute of Science and Technology",
    roleType: "Chief Patron",
    initials: "MJ",
    avatarColor: "from-purple-500 to-indigo-800"
  },
  {
    name: "Ms. Maria Bernadette Tamilarasi",
    title: "Vice President",
    organization: "Sathyabama Institute of Science and Technology",
    roleType: "Chief Patron",
    initials: "MB",
    avatarColor: "from-teal-500 to-emerald-700"
  },
  {
    name: "Mr. J. Arul Selvan",
    title: "Vice President",
    organization: "Sathyabama Institute of Science and Technology",
    roleType: "Chief Patron",
    initials: "AS",
    avatarColor: "from-amber-500 to-orange-700"
  },
  {
    name: "Ms. Maria Catherine Johnson",
    title: "Vice President",
    organization: "Sathyabama Institute of Science and Technology",
    roleType: "Chief Patron",
    initials: "MC",
    avatarColor: "from-rose-500 to-pink-700"
  }
];

export const CONVENORS: PatronProfile[] = [
  {
    name: "Dr. L. Lakshmanan",
    title: "Dean",
    organization: "School of Computing, SIST",
    roleType: "Convenor",
    initials: "LL",
    avatarColor: "from-blue-600 to-cyan-800",
    bio: "Visionary academic leader driving cutting-edge computing initiatives and student research excellence."
  },
  {
    name: "Dr. P. Ajitha",
    title: "Head of Department",
    organization: "CSE - AI, BCT, CS, CSBS, IoT",
    roleType: "Convenor",
    initials: "PA",
    avatarColor: "from-indigo-600 to-purple-800",
    bio: "Pioneering curriculum innovation across emerging computing domains and hackathon ecosystems."
  },
  {
    name: "Dr. Senduru Srinivasulu",
    title: "Head of Department",
    organization: "CSE - AIML, DS, AIR",
    roleType: "Convenor",
    initials: "SS",
    avatarColor: "from-violet-600 to-blue-900",
    bio: "Leading advanced research in Artificial Intelligence, Machine Learning, Data Science, and Robotics."
  }
];

export const CLUB_LEADERSHIP: PatronProfile[] = [
  {
    name: "Microsoft Club SIST",
    title: "Organizing Body & Mission Command",
    organization: "Sathyabama Institute of Science and Technology",
    roleType: "Club Lead",
    initials: "MS",
    avatarColor: "from-cyan-500 to-blue-600",
    bio: "A premier student technical community fostering developer excellence, cloud intelligence, and flagship nationwide hackathons."
  },
  {
    name: "Student Technical Directorate",
    title: "Mission Architects & WebGL Systems",
    organization: "Microsoft Club SIST",
    roleType: "Club Lead",
    initials: "TD",
    avatarColor: "from-purple-500 to-violet-700",
    bio: "Lead developers and spatial designers engineering the ORION 1.0 mission interface and hackathon infrastructure."
  },
  {
    name: "Operations & Event Command",
    title: "Logistics & Hospitality Core",
    organization: "Microsoft Club SIST",
    roleType: "Club Lead",
    initials: "OC",
    avatarColor: "from-emerald-500 to-teal-700",
    bio: "Dedicated crew coordinating 24-hour food, power, mentorship, accommodation, and participant welfare."
  }
];

export const MICROSOFT_OFFICE_BEARERS: OfficeBearer[] = [
  {
    name: "Nihitha Juliet A",
    title: "President",
    department: "IInd Yr CSE CSBS",
    phone: "8870227906",
    initials: "NJ",
    organization: "Microsoft Club SIST"
  },
  {
    name: "Harshini M",
    title: "Vice - President",
    department: "IIIrd Yr IT",
    phone: "7200524207",
    initials: "HM",
    organization: "Microsoft Club SIST"
  },
  {
    name: "Praveen Kumar S",
    title: "Cluster Co-ordinator",
    department: "IIIrd Yr CSE",
    phone: "9176594860",
    initials: "PK",
    organization: "Microsoft Club SIST"
  }
];

export const INITIAL_REGISTERED_TEAMS: RegisteredTeam[] = [
  {
    teamId: "ORION-9012",
    teamName: "Aether Dynamics",
    leaderName: "Kavya Ramesh",
    leaderEmail: "kavya.ramesh@sathyabama.ac.in",
    institution: "Sathyabama Institute of Science and Technology",
    track: "FloatChat (ARGO 4D)",
    membersCount: 4,
    status: "Qualified - Top 70 Finalist",
    registrationDate: "2026-08-10"
  },
  {
    teamId: "ORION-8421",
    teamName: "CipherNova",
    leaderName: "Aditya Verma",
    leaderEmail: "aditya.v@iitm.ac.in",
    institution: "IIT Madras",
    track: "LexVault (ZK eVault)",
    membersCount: 5,
    status: "Qualified - Top 70 Finalist",
    registrationDate: "2026-08-12"
  },
  {
    teamId: "ORION-7733",
    teamName: "BioCanopy Labs",
    leaderName: "Sneha Mukherjee",
    leaderEmail: "sneha.m@bits-pilani.ac.in",
    institution: "BITS Pilani",
    track: "SylvaSense (SAR Forestry)",
    membersCount: 4,
    status: "Qualified - Top 70 Finalist",
    registrationDate: "2026-08-14"
  },
  {
    teamId: "ORION-6590",
    teamName: "QuantumVortex",
    leaderName: "Rohit Nambiar",
    leaderEmail: "rohit.n@nitc.ac.in",
    institution: "NIT Calicut",
    track: "Open Innovation - AI & Systems",
    membersCount: 3,
    status: "Round 1 Pending Review",
    registrationDate: "2026-08-16"
  }
];

export const ORION_STARS: StarNodeData[] = [
  {
    name: "Betelgeuse",
    coords: [-2.2, 3.2, 0.4],
    role: "Alpha Orionis • Red Supergiant",
    designation: "α Ori / HD 39801",
    distance: "642.5 Light Years",
    apparentMagnitude: "0.50",
    size: 0.28,
    color: "#BAE6FD"
  },
  {
    name: "Rigel",
    coords: [2.5, -3.4, -0.3],
    role: "Beta Orionis • Blue-White Supergiant",
    designation: "β Ori / HD 34085",
    distance: "860 Light Years",
    apparentMagnitude: "0.13",
    size: 0.32,
    color: "#38BDF8"
  },
  {
    name: "Bellatrix",
    coords: [2.2, 3.0, 0.2],
    role: "Gamma Orionis • Amazon Star",
    designation: "γ Ori / HD 35468",
    distance: "250 Light Years",
    apparentMagnitude: "1.64",
    size: 0.22,
    color: "#FFFFFF"
  },
  {
    name: "Saiph",
    coords: [-2.1, -3.2, 0.1],
    role: "Kappa Orionis • Supergiant Star",
    designation: "κ Ori / HD 38771",
    distance: "650 Light Years",
    apparentMagnitude: "2.09",
    size: 0.2,
    color: "#38BDF8"
  },
  {
    name: "Alnitak",
    coords: [-0.9, 0.1, 0],
    role: "Zeta Orionis • Eastern Belt Star",
    designation: "ζ Ori / HD 37742",
    distance: "1,260 Light Years",
    apparentMagnitude: "1.77",
    size: 0.24,
    color: "#BAE6FD"
  },
  {
    name: "Alnilam",
    coords: [0, 0.0, 0],
    role: "Epsilon Orionis • Central Belt Star",
    designation: "ε Ori / HD 37128",
    distance: "2,000 Light Years",
    apparentMagnitude: "1.69",
    size: 0.26,
    color: "#FFFFFF"
  },
  {
    name: "Mintaka",
    coords: [0.9, -0.1, 0],
    role: "Delta Orionis • Western Belt Star",
    designation: "δ Ori / HD 36486",
    distance: "1,200 Light Years",
    apparentMagnitude: "2.23",
    size: 0.23,
    color: "#38BDF8"
  },
  {
    name: "Meissa",
    coords: [0.1, 4.4, 0.3],
    role: "Lambda Orionis • Head of Orion",
    designation: "λ Ori / HD 36861",
    distance: "1,100 Light Years",
    apparentMagnitude: "3.39",
    size: 0.18,
    color: "#7DD3FC"
  },
  {
    name: "Orion Nebula M42",
    coords: [0, -1.3, -0.2],
    role: "Diffuse Nebula • Stellar Nursery",
    designation: "NGC 1976 / Messier 42",
    distance: "1,344 Light Years",
    apparentMagnitude: "4.00",
    size: 0.3,
    color: "#60A5FA"
  }
];

export const CONSTELLATION_EDGES: [string, string][] = [
  ["Betelgeuse", "Bellatrix"],
  ["Betelgeuse", "Alnitak"],
  ["Bellatrix", "Mintaka"],
  ["Betelgeuse", "Meissa"],
  ["Bellatrix", "Meissa"],
  ["Alnitak", "Alnilam"],
  ["Alnilam", "Mintaka"],
  ["Alnitak", "Orion Nebula M42"],
  ["Orion Nebula M42", "Saiph"],
  ["Mintaka", "Rigel"],
  ["Saiph", "Rigel"]
];
