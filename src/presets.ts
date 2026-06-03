import { QuizCategory } from "./types";

export const PRESET_CATEGORIES: QuizCategory[] = [
  {
    id: "web-dev",
    name: "Web Development & React",
    description: "Test your mastery over modern React components, TypeScript quirks, and web fundamentals.",
    iconName: "Code",
    color: "indigo",
    questions: [
      {
        id: "wd-1",
        question: "What is the primary purpose of React's useSyncExternalStore hook?",
        options: [
          "To synchronize state updates across multiple separate browser tabs",
          "To subscribe and read from external data sources in a way that is compatible with concurrent rendering",
          "To perform synchronous side effects before the browser repaints the screen",
          "To establish a direct bidirectional WebSocket connection with a backend server"
        ],
        correctIndex: 1,
        explanation: "useSyncExternalStore is designed to safely read and subscribe to external data stores, preserving state integrity and avoiding 'tearing' during React's concurrent rendering phase."
      },
      {
        id: "wd-2",
        question: "Which of the following describes why you cannot put a hook inside a conditional 'if' statement?",
        options: [
          "Hooks require a separate luxury memory scope not accessible inside conditional blocks",
          "React relies on the absolute call order of hooks across render cycles to map local state to fiber nodes",
          "Conditional code paths automatically execute on a background Web Worker process",
          "Vite compiles conditional hook definitions into static unreactive constants"
        ],
        correctIndex: 1,
        explanation: "React reserves static arrays on each fiber node. By ensuring hooks are called in the exact same sequence on every render, React matches which hook corresponds to which state cell correctly."
      },
      {
        id: "wd-3",
        question: "In TypeScript, what is the key difference between 'type' and 'interface'?",
        options: [
          "Interfaces are parsed at runtime, while types are fully dismissed during transpilation",
          "Types support declarations merging, allowing you to redeclare the same name to append properties",
          "Interfaces support declaration merging, whereas types cannot be redeclared to merge properties",
          "Interfaces are limited to primitive types, while types only support nested key-value mappings"
        ],
        correctIndex: 2,
        explanation: "Interfaces can merge declarations of the same name with matching definitions automatically. Types are static assignments and throw compile-time duplication errors if redeclared."
      },
      {
        id: "wd-4",
        question: "Why should you avoid using an array's index as the 'key' prop when rendering dynamic lists in React?",
        options: [
          "React strictly rejects numeric values for keys and throws key-type errors",
          "Using indexes triggers full browser tab reloads whenever lists undergo reordering or deletions",
          "It can cause persistent UI bugs, mismatched input states, or sluggish performance during item insertions or reorderings",
          "Index-based keys completely disable standard CSS animations and transition triggers"
        ],
        correctIndex: 2,
        explanation: "If items in the list change order, shift, or are deleted, React matches virtual nodes by key. An index key maps old states to new positions blindly, causing inputs or component state to mismatch."
      },
      {
        id: "wd-5",
        question: "What does the CSS property 'contain: layout paint;' accomplish?",
        options: [
          "It forces all background colors to remain inside the element's direct bounding box",
          "It tells the browser that the element's children do not affect the layout or paint of others, enabling layout performance isolation",
          "It automatically compresses image paint assets to improve mobile page loading performance",
          "It prevents the user from selecting or dragging text within that container segment"
        ],
        correctIndex: 1,
        explanation: "The 'contain' property provides layout, style, and paint containment, allowing browsers to skip calculations on isolated subtrees, significantly enhancing rendering performance."
      }
    ]
  },
  {
    id: "space-astronomy",
    name: "Cosmos & Astronomy",
    description: "Embark on a journey across galaxies, planetary physics, and landmark astronomical missions.",
    iconName: "Globe",
    color: "amber",
    questions: [
      {
        id: "sa-1",
        question: "What is the physical mechanism behind a 'gravitational slingshot' (gravity assist) maneuver for spacecraft?",
        options: [
          "The spacecraft burns a massive payload of fuel in the direction of the planet's core",
          "The spacecraft pulls the planet slightly closer, generating an electrical current in interplanetary space",
          "The spacecraft steals a tiny portion of the planet's orbital kinetic energy, transferring momentum to speed up",
          "Solar winds bouncing off the planetary magnetic atmosphere accelerate the spacecraft"
        ],
        correctIndex: 2,
        explanation: "As the craft passes through a planet's gravity well, it essentially rides the planet's orbital speed. Momentum is conserved: the craft speeds up, and the planet slows down by an imperceptibly tiny fraction."
      },
      {
        id: "sa-2",
        question: "Why is Venutian surface temperature hotter than Mercury's surface temperature, despite being further from the Sun?",
        options: [
          "Mercury's core is liquid nitrogen, keeping its top surface cool",
          "Venus has a highly dense atmosphere composed of greenhouse gases that trap solar heat",
          "Venus has tidal friction currents generated by its three major companion moons",
          "Active radioactive decay on the Venusian surface releases infinite heat waves"
        ],
        correctIndex: 1,
        explanation: "Venus is covered by an extremely thick carbon-dioxide-rich atmosphere and clouds of sulfuric acid, causing a runaway greenhouse effect that locks temperatures at a scorching 470°C (880°F)."
      },
      {
        id: "sa-3",
        question: "What is the defining boundary of a stellar Black Hole known as the 'Event Horizon'?",
        options: [
          "The physical surface of the collapsed neutron star itself",
          "The safety zone where spaceships can refuel without getting locked in orbital pull",
          "The boundary threshold where the escape velocity required equals or exceeds the speed of light",
          "The exact center point of infinite density and zero volume inside the black hole"
        ],
        correctIndex: 2,
        explanation: "At the event horizon, gravitational pulling is so intense that nothing—not even electromagnetic waves like light—possesses enough speed to overcome the escape barrier."
      },
      {
        id: "sa-4",
        question: "What was the main scientific detection target of the LIGO observatory?",
        options: [
          "Mapping high-frequency cosmic microwave background deviations",
          "Detecting tiny spatial distortions caused by Gravitational Waves passing through Earth",
          "Tracking fast-moving asteroid trajectories in close Earth proximity",
          "Capturing liquid water vapor columns on Jupiter's moon Europa"
        ],
        correctIndex: 1,
        explanation: "LIGO excels in measuring microscopic distance shifts (smaller than a subatomic nucleus) using laser interferometry to confirm gravitational warps generated by colliding black holes or neutron stars."
      },
      {
        id: "sa-5",
        question: "Which planetary moon is renowned for its active methane lakes and nitrogen atmosphere?",
        options: [
          "Titan (Moon of Saturn)",
          "Europa (Moon of Jupiter)",
          "Triton (Moon of Neptune)",
          "Phobos (Moon of Mars)"
        ],
        correctIndex: 0,
        explanation: "Titan is the only known moon in our solar system with a dense atmosphere and stable surface bodies of liquid. Instead of liquid water, Titan features liquid methane, ethane, and hydrocarbon seas."
      }
    ]
  },
  {
    id: "general-science",
    name: "General Science & Earth",
    description: "Discover incredible science tidbits about our planet, atoms, and molecular mysteries.",
    iconName: "Atom",
    color: "teal",
    questions: [
      {
        id: "gs-1",
        question: "How does water absorb heat compared to other common natural liquids?",
        options: [
          "It has a very low specific heat capacity, heating up and cooling down instantly",
          "It has a exceptionally high specific heat capacity owing to strong intermolecular hydrogen bonding",
          "It generates heat through rapid molecular fission at normal room rates",
          "It is completely transparent to thermal wavelengths and does not absorb energy"
        ],
        correctIndex: 1,
        explanation: "Because of extensive hydrogen bonds, it takes a significant amount of input thermal energy to break those connections and accelerate water molecules, giving water an extremely high specific heat capacity."
      },
      {
        id: "gs-2",
        question: "What is the primary product of the fusion reaction occurring in our Sun's core during its main-sequence lifespan?",
        options: [
          "Helium-4 nuclei fused from hydrogen protons",
          "Liquid iron isotope deposits centered in core grids",
          "Heavy carbon and silicon atoms from radioactive fission",
          "Pure deuterium plasma water cells"
        ],
        correctIndex: 0,
        explanation: "The Sun is currently in its main sequence phase, converting hydrogen nuclei (protons) into helium-4 nuclei through the proton-proton chain reaction, releasing immense light and radiation."
      }
    ]
  }
];
