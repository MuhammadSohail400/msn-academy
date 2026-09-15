export const mockEnrolledCourses = [
  {
    id: "solar-pv-tech",
    title: "Certified Solar PV System Design & Installation",
    subtitle: "Complete hands-on vocational certification for rooftop & commercial solar plants in Pakistan",
    category: "Renewable Energy & Vocational",
    instructor: {
      name: "Engr. Tariq Mehmood",
      title: "Senior Renewable Systems Specialist (PEC Registered)",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
    },
    thumbnail: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80",
    progress: 78,
    totalLessons: 18,
    completedLessons: 14,
    totalDuration: "14h 30m",
    lastAccessedLesson: {
      id: "mod-3-lesson-2",
      title: "Inverter Sizing & MPPT String Calculation",
      moduleTitle: "Module 3: Power Electronics & Inverter Selection"
    },
    status: "in-progress",
    enrolledDate: "2026-08-10",
    hasPassedAssessment: false,
    assessmentEligible: true,
    modules: [
      {
        id: "mod-1",
        title: "Module 1: Fundamentals of Solar Photovoltaics in Pakistan",
        duration: "3h 15m",
        completed: true,
        lessons: [
          {
            id: "mod-1-lesson-1",
            title: "Solar Irradiation & Sun Hours in Punjab & Sindh",
            duration: "24:10",
            completed: true,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            summary: "Learn how to calculate Peak Sun Hours (PSH) across major Pakistani cities (Karachi, Lahore, Multan, Quetta) using NASA and Meteonorm meteorological data.",
            keyTopics: [
              "Solar Insolation & PSH metrics",
              "Azimuth & Optimal Tilt angles for 24°–36° N latitudes",
              "Dust and temperature derating factors in summer peak",
              "NEPRA net-metering regulatory framework"
            ],
            resources: [
              { name: "Pakistan_Solar_Irradiation_Atlas.pdf", size: "3.4 MB", type: "pdf" },
              { name: "Optimal_Tilt_Angle_Calculator.xlsx", size: "1.1 MB", type: "sheet" }
            ]
          },
          {
            id: "mod-1-lesson-2",
            title: "Photovoltaic Cell Technologies: Mono-PERC vs TOPCon",
            duration: "31:45",
            completed: true,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            summary: "Technical comparison of modern N-type TOPCon, HJT, and bifacial solar panels imported into Pakistan.",
            keyTopics: [
              "P-type vs N-type cell architecture",
              "Bifaciality coefficient and albedo surfaces",
              "Degradation rates (LID & PID mitigation)",
              "Tier-1 BloombergNEF manufacturer auditing"
            ],
            resources: [
              { name: "TOPCon_Datasheet_Analysis_Guide.pdf", size: "2.8 MB", type: "pdf" }
            ]
          }
        ]
      },
      {
        id: "mod-2",
        title: "Module 2: Mechanical Structure & Rooftop Mounting",
        duration: "4h 10m",
        completed: true,
        lessons: [
          {
            id: "mod-2-lesson-1",
            title: "Wind Load Calculations & Elevated Structure Design",
            duration: "28:50",
            completed: true,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            summary: "Designing galvanized iron (GI) L2 and L3 structures to withstand 120 km/h wind gusts during monsoon storms.",
            keyTopics: [
              "Structural steel gauges (14-gauge vs 16-gauge)",
              "Chemical anchoring & RCC roof waterproofing sealant",
              "Shadow analysis & inter-row pitch spacing",
              "Galvanization standards (80-120 micron dip)"
            ],
            resources: [
              { name: "Elevated_Structure_CAD_Drawing.dwg", size: "5.2 MB", type: "cad" },
              { name: "Wind_Load_Standards_PEC.pdf", size: "4.1 MB", type: "pdf" }
            ]
          }
        ]
      },
      {
        id: "mod-3",
        title: "Module 3: Power Electronics & Inverter Selection",
        duration: "3h 45m",
        completed: false,
        lessons: [
          {
            id: "mod-3-lesson-1",
            title: "On-Grid vs Hybrid vs Off-Grid Topology",
            duration: "36:20",
            completed: true,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
            summary: "Selecting inverters for the Pakistani grid with load shedding, three-phase unbalance, and voltage fluctuations.",
            keyTopics: [
              "Three-phase net-metering synchronization",
              "Hybrid lithium battery inverter integration",
              "Anti-islanding protection and DISCO compliance",
              "Transformerless inverter topology & leakage current"
            ],
            resources: [
              { name: "Inverter_Comparison_Matrix.pdf", size: "1.9 MB", type: "pdf" }
            ]
          },
          {
            id: "mod-3-lesson-2",
            title: "Inverter Sizing & MPPT String Calculation",
            duration: "42:15",
            completed: false,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
            summary: "Calculate minimum and maximum series strings based on open-circuit voltage Voc at -5°C minimum winter temperature.",
            keyTopics: [
              "Maximum Power Point Tracking (MPPT) voltage window",
              "Temperature coefficient of Voc and Vmp",
              "DC/AC ratio optimization (1.2x to 1.35x oversizing)",
              "DC Surge Protection Devices (Type II SPD) sizing"
            ],
            resources: [
              { name: "String_Sizing_Formula_Sheet.pdf", size: "2.2 MB", type: "pdf" },
              { name: "MPPT_Simulation_Spreadsheet.xlsx", size: "950 KB", type: "sheet" }
            ]
          }
        ]
      },
      {
        id: "mod-4",
        title: "Module 4: Safety, Earthing & Final NEPRA Commissioning",
        duration: "3h 20m",
        completed: false,
        lessons: [
          {
            id: "mod-4-lesson-1",
            title: "Dedicated Earthing Pit Installation & Megger Testing",
            duration: "33:10",
            completed: false,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
            summary: "Step-by-step preparation of copper bonded earth pits using bentonite powder to achieve < 5 Ohms resistance.",
            keyTopics: [
              "AC vs DC dedicated earthing separation",
              "Lightning arrestor cone radius of protection",
              "Earth resistance test using 3-pole digital clamp meter",
              "NEPRA Green Meter inspection checklist"
            ],
            resources: [
              { name: "NEPRA_Inspection_SOP.pdf", size: "3.7 MB", type: "pdf" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "industrial-plc",
    title: "Industrial PLC & Automation Engineering",
    subtitle: "Siemens S7-1200 / S7-1500, TIA Portal, HMI Design & SCADA Architecture",
    category: "Industrial Engineering",
    instructor: {
      name: "Engr. Salman Farooq",
      title: "Chief Automation Architect (Ex-Siemens Solution Partner)",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
    },
    thumbnail: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
    progress: 100,
    totalLessons: 22,
    completedLessons: 22,
    totalDuration: "18h 00m",
    lastAccessedLesson: {
      id: "mod-plc-5-lesson-4",
      title: "SCADA Tag Alarms & Factory Historian Logging",
      moduleTitle: "Module 5: Advanced SCADA Deployment"
    },
    status: "completed",
    enrolledDate: "2026-06-15",
    hasPassedAssessment: true,
    assessmentScore: 88,
    certificateId: "MSN-2026-PLC-7741",
    assessmentEligible: true,
    modules: [
      {
        id: "mod-plc-1",
        title: "Module 1: Industrial Hardware & Digital/Analog I/O",
        duration: "3h 30m",
        completed: true,
        lessons: [
          {
            id: "mod-plc-1-lesson-1",
            title: "Wiring Sinking vs Sourcing PNP/NPN Sensors",
            duration: "25:00",
            completed: true,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            summary: "Industrial cabinet wiring standards, 24V DC auxiliary power supplies, and optocoupler isolation.",
            keyTopics: ["PNP vs NPN polarity", "Sink/Source digital inputs", "24V DC power distribution"],
            resources: [{ name: "PLC_Wiring_Standards.pdf", size: "2.1 MB", type: "pdf" }]
          }
        ]
      }
    ]
  },
  {
    id: "fullstack-mern",
    title: "Full-Stack Web Development & Cloud Architecture",
    subtitle: "React 19, TypeScript, Node.js REST API, Redis Queues & Production Docker Deployment",
    category: "Software Development",
    instructor: {
      name: "Muhammad Bilal",
      title: "Staff Engineer & Cloud Architect",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80"
    },
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
    progress: 32,
    totalLessons: 26,
    completedLessons: 8,
    totalDuration: "22h 15m",
    lastAccessedLesson: {
      id: "mod-fs-2-lesson-3",
      title: "Custom React Hooks & Performance Memoization",
      moduleTitle: "Module 2: Advanced React Patterns"
    },
    status: "in-progress",
    enrolledDate: "2026-08-28",
    hasPassedAssessment: false,
    assessmentEligible: false,
    modules: [
      {
        id: "mod-fs-1",
        title: "Module 1: Modern JavaScript & TypeScript Essentials",
        duration: "4h 00m",
        completed: true,
        lessons: [
          {
            id: "mod-fs-1-lesson-1",
            title: "Async/Await, Microtasks & Event Loop Internals",
            duration: "35:00",
            completed: true,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            summary: "Deep dive into V8 engine execution contexts, Promise scheduling, and memory leak prevention.",
            keyTopics: ["Call stack & macrotask queue", "Promise race and allSettled", "Garbage collection"],
            resources: [{ name: "JS_Event_Loop_Cheatsheet.pdf", size: "1.4 MB", type: "pdf" }]
          }
        ]
      }
    ]
  }
];

export const mockStudentProfile = {
  name: "Ahmed Raza",
  studentId: "MSN-STD-2026-892",
  email: "ahmed.raza@example.com",
  phone: "+92 300 1234567",
  city: "Karachi, Pakistan",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
  stats: {
    enrolledCount: 3,
    inProgressCount: 2,
    completedCount: 1,
    certificatesEarned: 1,
    hoursLearned: 38.5,
    averageExamScore: 88
  }
};
