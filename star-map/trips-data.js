const tripsData = [
  {
    id: "moon",
    title: "Moon Phases",
    date: "August 12, 2024",
    location: "Backyard Observatory",
    photoCount: 8,
    notes: "Clear night. Captured multiple moon phases with stunning crater detail. Used 200mm lens with tripod.",
    color: "#E8E8E8", // silver-white
    position: { x: 20, y: 30 }, // % from top-left
    size: "large", // large/medium/small
    folder: "Moon"
  },
  {
    id: "sun",
    title: "Solar Observations",
    date: "July 4, 2024",
    location: "Desert National Park",
    photoCount: 12,
    notes: "Sunset photography session. Captured sun with interesting atmospheric effects and color gradients.",
    color: "#FFA500", // orange
    position: { x: 75, y: 15 },
    size: "large",
    folder: "Sun"
  },
  {
    id: "trip1",
    title: "Milky Way Core",
    date: "June 20, 2024",
    location: "Dark Sky Reserve",
    photoCount: 15,
    notes: "Perfect conditions for galactic center photography. Minimal light pollution, captured stunning detail of the core.",
    color: "#9D4EDD", // purple
    position: { x: 48, y: 62 },
    size: "medium",
    folder: "Trip1"
  },
  {
    id: "trip2",
    title: "Deep Sky Objects",
    date: "September 5, 2024",
    location: "Mountain Peak",
    photoCount: 20,
    notes: "Long exposure session targeting nebulae and galaxies. Andromeda galaxy came out particularly well.",
    color: "#3A86FF", // blue
    position: { x: 82, y: 58 },
    size: "medium",
    folder: "Trip2"
  },
  {
    id: "trip3",
    title: "Star Trails",
    date: "May 15, 2024",
    location: "Coastal Viewpoint",
    photoCount: 10,
    notes: "2-hour star trail sequence. Captured circular motion around Polaris with ocean in foreground.",
    color: "#06FFA5", // cyan-green
    position: { x: 12, y: 75 },
    size: "small",
    folder: "Trip3"
  }
];
