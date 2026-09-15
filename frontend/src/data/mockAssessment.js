export const mockAssessmentData = {
  courseId: "solar-pv-tech",
  courseTitle: "Certified Solar PV System Design & Installation",
  passingScorePercent: 70,
  timeLimitMinutes: 120,
  totalQuestions: 20,
  rules: [
    "You have exactly 120 minutes (2 hours) to complete 20 multiple choice questions.",
    "A minimum passing score of 70% (14 out of 20 correct answers) is required to receive your official certificate.",
    "You can navigate freely between questions using the Question Navigator grid.",
    "Use the 'Flag for Review' toggle to bookmark questions you want to double-check before submission.",
    "Do not close or refresh your browser window during the assessment.",
    "Your assessment will automatically submit when the 120-minute countdown expires."
  ],
  questions: [
    {
      id: 1,
      domain: "Meteorology & Solar Insolation",
      question: "Which solar insolational metric represents the total solar energy falling on a tilted surface, incorporating direct, diffuse, and ground-reflected radiation?",
      options: [
        { id: "A", label: "Direct Normal Irradiance (DNI)" },
        { id: "B", label: "Global Tilted Irradiance (GTI)" },
        { id: "C", label: "Diffuse Horizontal Irradiance (DHI)" },
        { id: "D", label: "Air Mass 1.5 Spectrum (AM1.5)" }
      ],
      correctOption: "B",
      explanation: "Global Tilted Irradiance (GTI) measures total irradiation hitting a solar PV collector angled at a specific tilt, summing Direct, Diffuse, and Albedo components."
    },
    {
      id: 2,
      domain: "Cell Technologies",
      question: "What primary operational advantage do N-type TOPCon solar panels possess over traditional P-type Mono-PERC panels in Pakistan's high-temperature summer climate?",
      options: [
        { id: "A", label: "Lower temperature coefficient of Pmax (~ -0.30%/°C vs -0.35%/°C)" },
        { id: "B", label: "Higher Light-Induced Degradation (LID) in the first year" },
        { id: "C", label: "Inability to absorb diffuse light on cloudy days" },
        { id: "D", label: "Requirement for 48V DC battery connection only" }
      ],
      correctOption: "A",
      explanation: "TOPCon cells feature a superior temperature coefficient (~ -0.30%/°C), meaning power output drops significantly less during 45°C+ summer peaks."
    },
    {
      id: 3,
      domain: "Electrical Sizing",
      question: "When calculating the maximum series string length for an inverter with a 1000V DC ceiling, at what ambient temperature condition must the panel Open-Circuit Voltage (Voc) be calculated?",
      options: [
        { id: "A", label: "Maximum expected summer ambient temperature (+45°C)" },
        { id: "B", label: "Standard Test Condition (STC) temperature (+25°C)" },
        { id: "C", label: "Lowest historical winter ambient temperature (e.g. -5°C)" },
        { id: "D", label: "Nominal Module Operating Temperature (NMOT +42°C)" }
      ],
      correctOption: "C",
      explanation: "Because PV Voc rises as cell temperature drops, maximum string voltage occurs during cold winter mornings. Failing to calculate at minimum local temperature risks overvoltage destruction of inverter input stages."
    },
    {
      id: 4,
      domain: "Power Electronics",
      question: "Under NEPRA grid-interconnection regulations in Pakistan, what mandatory electrical safety mechanism prevents a grid-tied solar inverter from feeding power into a dead utility power line during DISCO power outages?",
      options: [
        { id: "A", label: "Maximum Power Point Tracking (MPPT)" },
        { id: "B", label: "Anti-Islanding Protection (IEEE 1547 / IEC 62116)" },
        { id: "C", label: "Zero Export Power Controller" },
        { id: "D", label: "Pure Sine Wave Modulation" }
      ],
      correctOption: "B",
      explanation: "Anti-islanding protection immediately disconnects grid-tie inverters within 2 seconds of a utility grid failure to protect DISCO line technicians working on utility poles."
    },
    {
      id: 5,
      domain: "Structural & Wind Loading",
      question: "What minimum zinc galvanization thickness is specified for outdoor elevated L3 structural steel frames to ensure a 25-year corrosion resistance in humid coastal regions like Karachi?",
      options: [
        { id: "A", label: "10-20 microns" },
        { id: "B", label: "80-120 microns (Hot-Dip Galvanized ISO 1461)" },
        { id: "C", label: "Cold spray electro-plating" },
        { id: "D", label: "Standard black oxide primer paint" }
      ],
      correctOption: "B",
      explanation: "Hot-dip galvanizing per ISO 1461 with 80-120 micron coating thickness provides the required barrier protection against saline coastal corrosion."
    },
    {
      id: 6,
      domain: "Electrical Sizing",
      question: "For a 10kW 3-phase hybrid inverter with an MPPT voltage range of 200V - 850V, what is the optimal string Vmp target range for maximum inverter efficiency?",
      options: [
        { id: "A", label: "100V - 180V" },
        { id: "B", label: "580V - 620V (near nominal bus voltage)" },
        { id: "C", label: "880V - 950V" },
        { id: "D", label: "50V - 100V" }
      ],
      correctOption: "B",
      explanation: "Designing string Vmp close to the inverter's internal DC bus voltage (~600V) minimizes boost converter switching losses."
    },
    {
      id: 7,
      domain: "Safety & Earthing",
      question: "What maximum electrical resistance to earth ground is permissible for a dedicated solar DC earthing pit according to PEC electrical standards?",
      options: [
        { id: "A", label: "Less than 5.0 Ohms (< 5 Ω)" },
        { id: "B", label: "Less than 100 Ohms" },
        { id: "C", label: "Exactly 50 Ohms" },
        { id: "D", label: "Resistance does not matter" }
      ],
      correctOption: "A",
      explanation: "Dedicated earthing pits must achieve an earth resistance below 5 Ohms (measured via 3-pole earth resistance clamp meter) to safely divert lightning and fault currents."
    },
    {
      id: 8,
      domain: "Batteries & Storage",
      question: "Which battery chemistry delivers the longest cycle life (~6000 cycles at 80% Depth of Discharge) for commercial hybrid solar energy storage in Pakistan?",
      options: [
        { id: "A", label: "Lead-Acid Flooded Tubular" },
        { id: "B", label: "Sealed AGM Gel" },
        { id: "C", label: "Lithium Iron Phosphate (LiFePO4)" },
        { id: "D", label: "Nickel Cadmium (NiCd)" }
      ],
      correctOption: "C",
      explanation: "Lithium Iron Phosphate (LiFePO4) offers thermal stability, high current discharge, and over 6000 cycles at 80% DOD."
    },
    {
      id: 9,
      domain: "Wiring & Protection",
      question: "Why must solar DC cables utilize XLPO cross-linked insulation instead of standard indoor PVC wire?",
      options: [
        { id: "A", label: "XLPO handles UV radiation, ozone, and temperatures up to 120°C" },
        { id: "B", label: "XLPO cables are cheaper than aluminum wire" },
        { id: "C", label: "PVC cables carry higher AC voltage" },
        { id: "D", label: "XLPO prevents string voltage from exceeding 12V" }
      ],
      correctOption: "A",
      explanation: "Rooftop solar DC wiring is exposed to intense UV rays and ambient heat under panel backs. XLPO rated cables prevent insulation embrittlement and short circuits."
    },
    {
      id: 10,
      domain: "NEPRA Net-Metering",
      question: "Under NEPRA net-metering regulations, what type of bidirectional energy meter is installed at the consumer premises?",
      options: [
        { id: "A", label: "Single-phase electromechanical analog meter" },
        { id: "B", label: "3-Phase 4-Wire Bidirectional Smart Green Meter with RS-485 GSM module" },
        { id: "C", label: "Standard prepaid card sub-meter" },
        { id: "D", label: "Current Transformer without voltage sense" }
      ],
      correctOption: "B",
      explanation: "NEPRA requires a certified 3-phase bidirectional Green Meter equipped with remote AMR/GSM telemetry for recorded energy import/export audit."
    },
    {
      id: 11,
      domain: "System Commissioning",
      question: "What handheld diagnostic instrument is used to check solar panel string voltage polarity and open circuit voltage before plugging into inverter DC isolators?",
      options: [
        { id: "A", label: "CAT III / CAT IV 1000V True-RMS Digital Multimeter" },
        { id: "B", label: "Phase Sequence Indicator" },
        { id: "C", label: "Lux Meter" },
        { id: "D", label: "Oscilloscope" }
      ],
      correctOption: "A",
      explanation: "A CAT III/IV 1000V rated multimeter is essential to safely measure high-voltage DC string polarity and open-circuit voltage."
    },
    {
      id: 12,
      domain: "Mechanical Structure",
      question: "What is the primary function of inter-row pitch spacing calculation in multi-row commercial rooftop solar arrays?",
      options: [
        { id: "A", label: "To reduce panel cleaning labor" },
        { id: "B", label: "To prevent row-to-row shading during winter solstice 9:00 AM to 3:00 PM" },
        { id: "C", label: "To increase inverter AC wire length" },
        { id: "D", label: "To allow rainwater harvesting" }
      ],
      correctOption: "B",
      explanation: "Proper pitch spacing guarantees that front panel rows do not cast inter-row shadow onto rear panel rows during low winter sun angles."
    },
    {
      id: 13,
      domain: "Electrical Sizing",
      question: "If a 550W solar module has Vmp = 41.5V and Imp = 13.25A, what is the expected maximum operating current for 2 parallel strings?",
      options: [
        { id: "A", label: "13.25 A" },
        { id: "B", label: "26.50 A" },
        { id: "C", label: "83.0 V" },
        { id: "D", label: "53.0 A" }
      ],
      correctOption: "B",
      explanation: "In parallel connections, voltage remains equal to string voltage while current sums (13.25A + 13.25A = 26.50A)."
    },
    {
      id: 14,
      domain: "Protection Devices",
      question: "What Type of Surge Protection Device (SPD) is mandatory inside the DC Combiner Box to safeguard solar string inputs against atmospheric indirect lightning strikes?",
      options: [
        { id: "A", label: "Type II DC Surge Protector (1000V DC)" },
        { id: "B", label: "Single-phase RCBO" },
        { id: "C", label: "Thermal overload relay" },
        { id: "D", label: "Zener diode pair" }
      ],
      correctOption: "A",
      explanation: "Type II DC SPDs divert high-energy transient voltage surges safely to the dedicated DC earth pit."
    },
    {
      id: 15,
      domain: "Maintenance & Inspection",
      question: "Thermal imaging infrared (IR) camera inspection of solar panels during full afternoon operating sun reveals localized hot spots. What is the most probable root cause?",
      options: [
        { id: "A", label: "Clean panel glass" },
        { id: "B", label: "Cracked cell, bird dropping shade, or bypassed reverse-biased diode fault" },
        { id: "C", label: "Over-sized DC wire gauge" },
        { id: "D", label: "High AC grid frequency" }
      ],
      correctOption: "B",
      explanation: "Local shading or micro-cracks force solar cells into reverse bias, causing high localized thermal heating (hot spots)."
    },
    {
      id: 16,
      domain: "Power Electronics",
      question: "What metric defines the total harmonic distortion (THD) threshold permissible for grid-connected inverter AC output under IEEE 519 standards?",
      options: [
        { id: "A", label: "< 3% THD" },
        { id: "B", label: "> 15% THD" },
        { id: "C", label: "Exactly 25% THD" },
        { id: "D", label: "No harmonic limit" }
      ],
      correctOption: "A",
      explanation: "High-quality solar inverters maintain current Total Harmonic Distortion below 3% to prevent heating transformer windings."
    },
    {
      id: 17,
      domain: "Meteorology & Solar Insolation",
      question: "Why is Azimuth angle set to 180° (True South) for optimal annual solar generation in Pakistan?",
      options: [
        { id: "A", label: "Because Pakistan is located in the Northern Hemisphere" },
        { id: "B", label: "Because Pakistan is located in the Southern Hemisphere" },
        { id: "C", label: "To align with monsoon winds" },
        { id: "D", label: "To match magnetic north declination" }
      ],
      correctOption: "A",
      explanation: "In the Northern Hemisphere, facing panels True South (180° Azimuth) maximizes daily solar energy capture."
    },
    {
      id: 18,
      domain: "Wiring & Protection",
      question: "What color coding standard is universally specified for DC Positive (+) and DC Negative (-) solar string conductors?",
      options: [
        { id: "A", label: "Red (+) and Black (-)" },
        { id: "B", label: "Green (+) and Yellow (-)" },
        { id: "C", label: "Blue (+) and Brown (-)" },
        { id: "D", label: "White (+) and Grey (-)" }
      ],
      correctOption: "A",
      explanation: "Standard DC wiring convention uses Red for Positive (+) and Black for Negative (-)."
    },
    {
      id: 19,
      domain: "System Commissioning",
      question: "What insulation resistance measurement (Megger test) value indicates safe cable integrity for a 1000V DC solar array prior to energization?",
      options: [
        { id: "A", label: "Greater than 1 Mega-Ohm (> 1 MΩ at 1000V DC test)" },
        { id: "B", label: "0.1 Ohms" },
        { id: "C", label: "Zero Ohms" },
        { id: "D", label: "Negative 5 Ohms" }
      ],
      correctOption: "A",
      explanation: "Megger insulation resistance testing must read > 1 MΩ (typically tens of MΩ) to confirm no insulation breach."
    },
    {
      id: 20,
      domain: "Safety & Earthing",
      question: "What protective safety equipment must an engineer wear when making live connections inside a 1000V DC combiner box?",
      options: [
        { id: "A", label: "1000V rated insulated gloves, arc-flash face shield, and safety boots" },
        { id: "B", label: "Standard cotton gardening gloves" },
        { id: "C", label: "No protective gear needed" },
        { id: "D", label: "Dust mask only" }
      ],
      correctOption: "A",
      explanation: "High-voltage DC arc flashes are non-self-extinguishing. Class 0 (1000V) electrical insulating gloves and safety gear are mandatory."
    }
  ]
};

export const mockPassResult = {
  scorePercent: 85,
  scorePoints: 17,
  totalPoints: 20,
  passingThreshold: 70,
  isPassed: true,
  completionTimeFormatted: "1h 14m 22s",
  candidateName: "Ahmed Raza",
  candidateId: "MSN-STD-2026-892",
  certificateId: "MSN-2026-SOL-8819",
  issueDate: "September 15, 2026",
  domainBreakdown: [
    { domain: "Meteorology & Solar Insolation", total: 3, correct: 3, percent: 100 },
    { domain: "Cell Technologies & PV Modules", total: 3, correct: 3, percent: 100 },
    { domain: "Electrical Sizing & String Sizing", total: 4, correct: 3, percent: 75 },
    { domain: "Power Electronics & Inverter Topology", total: 4, correct: 3, percent: 75 },
    { domain: "Structural & Mechanical Mounting", total: 3, correct: 3, percent: 100 },
    { domain: "Safety, Earthing & Commissioning", total: 3, correct: 2, percent: 67 }
  ]
};

export const mockFailResult = {
  scorePercent: 55,
  scorePoints: 11,
  totalPoints: 20,
  passingThreshold: 70,
  isPassed: false,
  completionTimeFormatted: "1h 48m 10s",
  candidateName: "Ahmed Raza",
  candidateId: "MSN-STD-2026-892",
  retakesAllowed: "Unlimited",
  cooldownPeriod: "Immediate",
  domainBreakdown: [
    { domain: "Meteorology & Solar Insolation", total: 3, correct: 2, percent: 67 },
    { domain: "Cell Technologies & PV Modules", total: 3, correct: 2, percent: 67 },
    { domain: "Electrical Sizing & String Sizing", total: 4, correct: 2, percent: 50 },
    { domain: "Power Electronics & Inverter Topology", total: 4, correct: 2, percent: 50 },
    { domain: "Structural & Mechanical Mounting", total: 3, correct: 2, percent: 67 },
    { domain: "Safety, Earthing & Commissioning", total: 3, correct: 1, percent: 33 }
  ],
  recommendedModules: [
    "Module 3: Power Electronics & Inverter Selection (Review String Sizing & Vmp math)",
    "Module 4: Safety, Earthing & Final NEPRA Commissioning (Review Earth pit resistance & Megger test)"
  ]
};
