// Brand content ported from the prototype. Used by public pages AND the DB seed.

export type SpaceKey = "WILDERNESS" | "OCEAN" | "URBAN";

export const SITE = {
  name: "pepvoga",
  tagline: "A marketplace for the untamed.",
  blurb:
    "Book adventure stays and experiences — scuba, surf, climb, fly, ride — with vetted local operators worldwide.",
  email: "hello@pepvoga.com",
  coords: "28°36'N 77°12'E",
};

export const NAV_LINKS = [
  { label: "Stays", href: "/stays" },
  { label: "Experiences", href: "/experiences" },
  { label: "Spaces", href: "/spaces" },
  { label: "Community", href: "/community" },
  { label: "About", href: "/about" },
] as const;

export const STATS = [
  { value: "12K+", label: "Members worldwide" },
  { value: "80+", label: "Sports & disciplines" },
  { value: "340+", label: "Destinations" },
  { value: "28", label: "Countries active" },
] as const;

export const TICKER = [
  "Scuba Diving · Koh Tao",
  "Surfing · Uluwatu",
  "Rock Climbing · Yosemite",
  "Paragliding · Bir Billing",
  "Expedition Cycling · Karakoram",
  "Kitesurfing · Tarifa",
  "Trail Running · Chamonix",
  "Mountaineering · Everest Base Camp",
  "Freediving · Dahab",
  "Ice Climbing · Patagonia",
];

export const DESTINATIONS = [
  { name: "Koh Tao", region: "Thailand" },
  { name: "Uluwatu", region: "Bali" },
  { name: "Yosemite", region: "USA" },
  { name: "Chamonix", region: "France" },
  { name: "Raja Ampat", region: "Indonesia" },
  { name: "Bir Billing", region: "India" },
  { name: "Nazaré", region: "Portugal" },
  { name: "Dahab", region: "Egypt" },
  { name: "Queenstown", region: "New Zealand" },
  { name: "Hampi", region: "India" },
];

export interface SpaceContent {
  key: SpaceKey;
  slug: string;
  name: string;
  short: string;
  tagline: string;
  blurb: string;
  image: string;
  coords: string;
  attrs: { k: string; v: string }[];
  sports: string[];
}

export const SPACES: SpaceContent[] = [
  {
    key: "WILDERNESS",
    slug: "wilderness",
    name: "Wilderness & Mountains",
    short: "Wilderness",
    tagline: "Where the map runs out and the adventure begins.",
    blurb:
      "From forest trails in the Western Ghats to Himalayan routes — every mountain asks something different of you. Ridgelines, basecamp dawns, and summits that cost everything to reach.",
    image:
      "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1600&q=80",
    coords: "27°59'N 86°55'E",
    attrs: [
      { k: "Terrain", v: "Alpine, Forest, Desert, Tundra" },
      { k: "Skill range", v: "Beginner – Expedition" },
      { k: "Season", v: "Year-round (varies)" },
      { k: "Top regions", v: "Himalayas, Alps, Andes" },
    ],
    sports: ["Rock Climbing", "Expedition Cycling", "Trail Running", "Mountaineering"],
  },
  {
    key: "OCEAN",
    slug: "ocean",
    name: "Ocean & Open Water",
    short: "Ocean",
    tagline: "60% of Earth is ocean. Most people only see the surface.",
    blurb:
      "Whether threading a reef at 25m or reading a swell at dawn — water is the great equaliser. It doesn't care about your credentials. It demands respect and rewards commitment.",
    image:
      "https://images.unsplash.com/photo-1682687982501-1e58ab814714?auto=format&fit=crop&w=1600&q=80",
    coords: "0°21'S 130°10'E",
    attrs: [
      { k: "Water type", v: "Ocean, Sea, River, Lake" },
      { k: "Skill range", v: "First-timer – Expert" },
      { k: "Depth range", v: "Surface – 60m+ Technical" },
      { k: "Top regions", v: "Indo-Pacific, Caribbean, Med" },
    ],
    sports: ["Scuba Diving", "Surfing", "Kayaking", "Open Water Swim"],
  },
  {
    key: "URBAN",
    slug: "urban",
    name: "Crazy & Urban Edges",
    short: "Urban",
    tagline: "Cities are full of spaces that weren't designed to be explored.",
    blurb:
      "Rooftops, tunnels, abandoned buildings, vertical walls. Seeing the built environment as terrain — finding the extraordinary hiding inside the ordinary.",
    image:
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1600&q=80",
    coords: "35°41'N 139°41'E",
    attrs: [
      { k: "Environment", v: "Urban, Industrial, Sub-surface" },
      { k: "Skill range", v: "Explorer – Technical" },
      { k: "Access", v: "Public to Permitted Spaces" },
      { k: "Top cities", v: "Tokyo, Berlin, Mumbai, NYC" },
    ],
    sports: ["Slacklining", "Urban Exploration", "Caving", "Parkour"],
  },
];

export interface SportContent {
  slug: string;
  name: string;
  icon: string;
  space: SpaceKey;
  coords: string;
  tagline: string;
  about: string;
  image: string;
  pills: string[];
  destinations: string;
  countries: string[];
  sub: { icon: string; name: string; desc: string }[];
}

export const SPORTS: SportContent[] = [
  {
    slug: "scuba-diving",
    name: "Scuba Diving",
    icon: "🤿",
    space: "OCEAN",
    coords: "0°21'S 130°10'E",
    tagline: "60% of Earth is ocean. Most people only see the surface. Not us.",
    about:
      "Scuba opens a world of weightlessness, silence, and extraordinary life. Whether newly certified or chasing technical wrecks at depth — we connect you to the right dive.",
    image:
      "https://images.unsplash.com/photo-1682687982501-1e58ab814714?auto=format&fit=crop&w=1400&q=85",
    pills: ["Open Water", "Advanced OW", "Tech Diving", "Cave Diving", "Freediving"],
    destinations:
      "Raja Ampat, Blue Hole Dahab, Similan Islands, Great Blue Hole Belize, Red Sea, Komodo, Cocos Island.",
    countries: ["Indonesia", "Maldives", "Egypt", "Belize"],
    sub: [
      { icon: "🐠", name: "Reef Dives", desc: "Guided dives on living reefs worldwide." },
      { icon: "🚢", name: "Wreck Diving", desc: "WWII ships and sunken aircraft." },
      { icon: "🦈", name: "Pelagic Encounters", desc: "Sharks, mantas, and whale sharks." },
      { icon: "🕳️", name: "Cave & Cavern", desc: "Technical cave systems at depth." },
    ],
  },
  {
    slug: "surfing",
    name: "Surfing",
    icon: "🏄",
    space: "OCEAN",
    coords: "8°43'S 115°10'E",
    tagline: "No two waves are the same. Neither are the people who chase them.",
    about:
      "From mellow beach breaks to terrifying big wave slabs — surfing is a lifelong conversation between you, the ocean, and the world's coastlines.",
    image:
      "https://images.unsplash.com/photo-1505459668311-8dfac7952bf0?auto=format&fit=crop&w=1400&q=85",
    pills: ["Longboard", "Shortboard", "Big Wave", "SUP"],
    destinations:
      "G-Land Java, Uluwatu Bali, Hossegor France, J-Bay South Africa, Pipeline Hawaii, Mentawai Islands.",
    countries: ["Bali", "Hawaii", "Portugal"],
    sub: [
      { icon: "🌅", name: "Dawn Patrol", desc: "Early sessions with locals worldwide." },
      { icon: "🏖️", name: "Surf Camps", desc: "Multi-day camps at the world's best breaks." },
      { icon: "🌊", name: "Big Wave Clinics", desc: "Tow-in training for advanced surfers." },
      { icon: "🗺️", name: "Surf Trips", desc: "Member trips to remote, uncrowded breaks." },
    ],
  },
  {
    slug: "rock-climbing",
    name: "Rock Climbing",
    icon: "🧗",
    space: "WILDERNESS",
    coords: "37°38'N 119°32'W",
    tagline: "Every crack, crimp, and face is a problem worth solving.",
    about:
      "Climbing is chess on vertical terrain. From the belayer you trust with your life to the partner who gives you beta that actually works.",
    image:
      "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1400&q=85",
    pills: ["Bouldering", "Sport", "Trad", "Alpine"],
    destinations:
      "Yosemite, Kalymnos Greece, Fontainebleau, Red Rock Canyon, Hampi India, Railay Thailand, Dolomites.",
    countries: ["Europe", "USA", "Asia"],
    sub: [
      { icon: "🪨", name: "Bouldering", desc: "Problems, beta, grades outdoors." },
      { icon: "⛰️", name: "Multi-Pitch", desc: "Big wall adventures with partners." },
      { icon: "🏔️", name: "Alpine Routes", desc: "High altitude routes demanding everything." },
      { icon: "🌊", name: "Deep Water Solo", desc: "Sea cliffs. No rope. Pure adrenaline." },
    ],
  },
  {
    slug: "paragliding",
    name: "Paragliding",
    icon: "🪂",
    space: "WILDERNESS",
    coords: "32°01'N 76°44'E",
    tagline: "Launch off a mountain and the world makes a different kind of sense.",
    about:
      "Paragliding connects you to weather, landscape, and physics in a way no other sport does. From tandem flights to cross-country XC — the sky has infinite terrain.",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=85",
    pills: ["Tandem", "Solo P2", "XC", "Acro"],
    destinations:
      "Bir Billing India, Oludeniz Turkey, Interlaken, Col du Granon France, Pokhara Nepal, Annecy France.",
    countries: ["Himalayas", "Alps", "Nepal"],
    sub: [
      { icon: "☁️", name: "Thermal Flights", desc: "Thermal hunting with fellow pilots." },
      { icon: "🏕️", name: "Bivouac Trips", desc: "Fly and camp over multiple days." },
      { icon: "🌀", name: "Acro Training", desc: "Advanced manoeuvres with safety support." },
      { icon: "🎓", name: "P2 Courses", desc: "Community-recommended schools worldwide." },
    ],
  },
  {
    slug: "expedition-cycling",
    name: "Expedition Cycling",
    icon: "🚵",
    space: "WILDERNESS",
    coords: "32°44'N 74°51'E",
    tagline: "When the distance between places becomes the entire point.",
    about:
      "Bicycle touring collapses the map. You cover terrain slowly enough to truly understand it. Gravel routes, mountain passes, cross-continental odysseys.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1400&q=85",
    pills: ["Bikepacking", "Gravel", "MTB", "Road Touring"],
    destinations:
      "Manali to Leh, Trans-Siberian, Tour Divide, Cape to Cape Africa, Karakoram Highway, GDMBR USA.",
    countries: ["Asia", "Americas", "Africa"],
    sub: [
      { icon: "🏔️", name: "Mountain Passes", desc: "High altitude Himalayan climbs." },
      { icon: "🌍", name: "Cross-Country", desc: "Continent-spanning expeditions." },
      { icon: "🪨", name: "Gravel Races", desc: "Community entry into iconic events." },
      { icon: "🏕️", name: "Bikepacking Nights", desc: "Overnights into the unknown." },
    ],
  },
];

export const MORE_SPORTS = [
  { icon: "🏃", name: "Trail Running" },
  { icon: "🎿", name: "Skiing" },
  { icon: "🏂", name: "Snowboarding" },
  { icon: "🛶", name: "Kayaking" },
  { icon: "🪁", name: "Kitesurfing" },
  { icon: "🤸", name: "Slacklining" },
  { icon: "🧊", name: "Ice Climbing" },
  { icon: "🏞", name: "Canyoneering" },
  { icon: "🚣", name: "Whitewater Rafting" },
  { icon: "🏊", name: "Open Water Swim" },
  { icon: "⛷️", name: "Ski Touring" },
  { icon: "🌋", name: "Volcano Trek" },
  { icon: "🪂", name: "Skydiving" },
  { icon: "🏄", name: "Kiteboarding" },
  { icon: "🦇", name: "Wingsuit Flying" },
  { icon: "💨", name: "Windsurfing" },
  { icon: "🕯️", name: "Caving" },
  { icon: "🧭", name: "Orienteering" },
];

export interface ProviderCategory {
  type: string;
  icon: string;
  desc: string;
}

export const PROVIDER_CATEGORIES: ProviderCategory[] = [
  { type: "Dive Operator", icon: "🤿", desc: "Dive centres, liveaboards, PADI/SSI certified schools worldwide." },
  { type: "Surf School", icon: "🏄", desc: "Beginner lessons to advanced coaching. Surf camps and board rentals." },
  { type: "Climbing Gym / Guide", icon: "🧗", desc: "Indoor gyms, outdoor guiding, multi-pitch instruction." },
  { type: "Adventure Operator", icon: "🪂", desc: "Paragliding schools, skydive centres, whitewater operators." },
  { type: "Adventure Camp", icon: "🏕️", desc: "Multi-day expeditions, basecamp runs, adventure retreats." },
  { type: "Gear & Equipment", icon: "🎒", desc: "Rental shops, gear libraries, specialist outfitters." },
];

export const SERVICES_BY_CATEGORY: Record<string, string[]> = {
  "Dive Operator": ["Open Water Courses", "Advanced Courses", "Rescue Diver", "Tech Diving", "Cave Diving", "Wreck Diving", "Reef Dives", "Liveaboard", "Equipment Rental"],
  "Surf School": ["Beginner Lessons", "Intermediate Coaching", "Surf Camps", "Board Rental", "Video Analysis", "Fitness Training"],
  "Climbing Gym / Guide": ["Indoor Bouldering", "Sport Climbing", "Lead Climbing", "Multi-pitch Guiding", "Alpine Routes", "Mountaineering"],
  "Adventure Operator": ["Tandem Paragliding", "Solo P2 Courses", "Skydiving", "Whitewater Rafting", "Canyoning", "Via Ferrata"],
  "Adventure Camp": ["Day Expeditions", "Multi-day Treks", "Basecamp Runs", "Wilderness Survival", "Navigation Skills", "First Aid Training"],
  "Gear & Equipment": ["Daily Rental", "Weekly Rental", "Sales", "Custom Fitting", "Equipment Servicing", "Guided Tours with Gear"],
};

export const SERVICES_DEFAULT = ["Group Sessions", "Private Sessions", "Corporate Bookings", "Gift Vouchers", "Photography / Video", "Transfer Services"];

export const VALUES = [
  { title: "Go Further", desc: "Every objective is just a base camp for the next one. We're not interested in being comfortable." },
  { title: "Show Up", desc: "The best adventure partner isn't the most talented — it's the one who always shows up." },
  { title: "No Gatekeeping", desc: "Beginners and experts share the same trail. The community grows when everyone is welcome." },
  { title: "Leave It Better", desc: "Every space we use, we leave cleaner than we found it. The wild should outlast all of us." },
];

export const COMMUNITY_FEATURES = [
  { icon: "🗺️", title: "Partner Map", desc: "Find adventure partners in 80+ countries filtered by sport, level, and availability." },
  { icon: "📡", title: "Live Conditions", desc: "Real-time trail, wave, and weather reports from members on the ground right now." },
  { icon: "🎒", title: "Gear Library", desc: "Borrow specialised gear from community members near you before committing to buy." },
];

export const PARTNER_BENEFITS = [
  { title: "Qualified Audience", desc: "Our members book. They show up. They come back." },
  { title: "Community Trust", desc: "Listed partners are vetted. That trust transfers directly." },
  { title: "Zero Commission", desc: "Members contact you directly. You own every booking." },
  { title: "Analytics Dashboard", desc: "See views, saves, and enquiries in your partner portal." },
];

export const PARTNER_STEPS = [
  { title: "Apply Online", desc: "Fill the 5-step partner form. About 8 minutes." },
  { title: "Review (48hrs)", desc: "Our team reviews for community fit and quality." },
  { title: "Profile Setup", desc: "Access your partner portal to complete your listing." },
  { title: "Go Live", desc: "Visible to all pepvoga members immediately." },
  { title: "Grow Together", desc: "Featured in newsletters, posts, and curated lists." },
];

export const EXPERIENCE_LEVELS = [
  "All levels welcome",
  "Beginner to Intermediate",
  "Intermediate to Advanced",
  "Advanced / Expert Only",
];

export const PRICE_RANGES = [
  "Budget (Under $50/day)",
  "Mid-range ($50–$150/day)",
  "Premium ($150–$400/day)",
  "Luxury ($400+/day)",
];

export function spaceByKey(key: string) {
  return SPACES.find((s) => s.key === key);
}
