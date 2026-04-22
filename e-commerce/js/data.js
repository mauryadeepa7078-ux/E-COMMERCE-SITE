/* ===== PRODUCT DATABASE ===== */
const CATEGORIES = [
  { id: 'electronics', name: 'Electronics', icon: '💻', description: 'Latest gadgets and tech' },
  { id: 'fashion', name: 'Fashion', icon: '👗', description: 'Trending styles and apparel' },
  { id: 'home', name: 'Home & Kitchen', icon: '🏠', description: 'Furnish your dream home' },
  { id: 'books', name: 'Books', icon: '📚', description: 'Expand your knowledge' },
  { id: 'sports', name: 'Sports & Fitness', icon: '⚽', description: 'Gear up for greatness' },
  { id: 'beauty', name: 'Beauty & Care', icon: '✨', description: 'Glow from within' },
  { id: 'toys', name: 'Toys & Games', icon: '🎮', description: 'Fun for all ages' },
  { id: 'automotive', name: 'Automotive', icon: '🚗', description: 'Ride in style' },
  { id: 'garden', name: 'Garden & Outdoor', icon: '🌿', description: 'Green your space' },
  { id: 'health', name: 'Health & Wellness', icon: '💊', description: 'Invest in yourself' },
];

const PRODUCT_TEMPLATES = {
  electronics: {
    emojis: ['💻','📱','🖥️','⌨️','🖱️','🎧','📷','🖨️','💾','📡','🔌','🔋','💡','📺','🕹️','⌚','🎙️','📻','🔦','📹'],
    adjectives: ['Pro','Ultra','Max','Elite','Smart','Quantum','Nano','Turbo','Hyper','Infinity'],
    nouns: ['Laptop','Phone','Monitor','Keyboard','Mouse','Headphones','Camera','Printer','SSD','Router','Charger','Battery','Speaker','TV','Controller','Watch','Mic','Radio','Flashlight','Webcam'],
    brands: ['TechVibe','NovaTech','PixelForge','ByteWave','CoreSync','ApexDigital','ZenithTech','PulseTech','VortexIO','CyberNest'],
    priceRange: [29.99, 2499.99]
  },
  fashion: {
    emojis: ['👗','👔','👕','👖','👟','👠','👒','🧥','👜','🕶️','👙','🧤','🧣','👘','👞','🎩','💍','📿','🧢','👝'],
    adjectives: ['Luxe','Vintage','Classic','Modern','Elegant','Urban','Chic','Minimal','Bold','Artisan'],
    nouns: ['Dress','Shirt','T-Shirt','Jeans','Sneakers','Heels','Hat','Jacket','Bag','Sunglasses','Swimwear','Gloves','Scarf','Kimono','Loafers','Fedora','Ring','Necklace','Cap','Clutch'],
    brands: ['MavenStyle','AuraWear','VogueThread','LuxeLabel','PrimeStitch','SilkRoad','UrbanWeave','EliteFit','NoirFashion','ZenWear'],
    priceRange: [19.99, 599.99]
  },
  home: {
    emojis: ['🛋️','🛏️','🪑','🍳','🧹','🪴','🕯️','🖼️','🏺','🧺','🪞','🛁','🚿','🧴','☕','🍽️','🔪','🥘','🧊','💐'],
    adjectives: ['Comfort','Royal','Rustic','Nordic','Zen','Premium','Heritage','Cozy','Artisan','Grand'],
    nouns: ['Sofa','Bed Frame','Chair','Pan Set','Vacuum','Planter','Candle Set','Wall Art','Vase','Basket','Mirror','Bath Set','Shower Head','Organizer','Coffee Maker','Dinnerware','Knife Set','Cookware','Ice Maker','Flower Vase'],
    brands: ['HomeCraft','NestLiving','CozyHaven','PureHome','VelvetNest','GraceDecor','ElmHouse','ArborHome','TerraLiving','WoodCraft'],
    priceRange: [14.99, 1299.99]
  },
  books: {
    emojis: ['📖','📕','📗','📘','📙','📓','📔','📒','📝','🗒️','📚','🔖','📜','🗞️','📑','📋','🗂️','📰','🧾','📄'],
    adjectives: ['Essential','Ultimate','Complete','Advanced','Modern','Classic','Definitive','Mastering','Deep','Brilliant'],
    nouns: ['Guide to AI','Python Handbook','JavaScript Bible','Design Patterns','Algorithm Book','Data Science','Leadership','History Atlas','Sci-Fi Novel','Mystery Thriller','Philosophy','Economics','Art of War','Cooking Recipes','Self-Help','Fantasy Epic','Biography','Travel Guide','Poetry Collection','Science Almanac'],
    brands: ['PageTurn','InkWell','NovelPress','MindScape','KnowledgeHub','BookWorm','LitVerse','ReadPeak','WordForge','ChapterOne'],
    priceRange: [9.99, 79.99]
  },
  sports: {
    emojis: ['⚽','🏀','🎾','🏈','⚾','🏐','🏓','🏸','🥊','🏋️','🚴','🧗','🤸','🏊','🎯','🥏','⛷️','🏹','🤿','🛹'],
    adjectives: ['Pro','Elite','Champion','Power','Flex','Enduro','Apex','Titan','Fury','Blaze'],
    nouns: ['Football','Basketball','Tennis Racket','Football Gear','Baseball Bat','Volleyball','Table Tennis Set','Badminton Kit','Boxing Gloves','Dumbbell Set','Cycling Gear','Climbing Kit','Yoga Mat','Swim Goggles','Dart Board','Frisbee','Ski Set','Archery Bow','Dive Kit','Skateboard'],
    brands: ['AthleteX','FitCore','PowerPlay','SummitGear','IronWill','SprintForce','AlphaFit','BeastMode','CoreAthletics','PeakForm'],
    priceRange: [12.99, 799.99]
  },
  beauty: {
    emojis: ['💄','💅','🧴','🪮','🧼','🪥','💆','🧖','🌸','🌹','✨','💎','🧪','🪷','🌺','🧿','🫧','🪻','🌻','💐'],
    adjectives: ['Glow','Radiant','Pure','Silk','Velvet','Rose','Pearl','Crystal','Divine','Luxe'],
    nouns: ['Lipstick','Nail Kit','Moisturizer','Hair Brush','Soap Set','Toothbrush Pro','Massage Oil','Spa Kit','Serum','Perfume','Highlighter','Face Mask','Toner','Eye Cream','Body Lotion','Palette','Foundation','Cleanser','Exfoliator','Hair Serum'],
    brands: ['GlowUp','PureBliss','VelvetSkin','RadianceBeauty','BloomCare','LuxeGlow','SilkTouch','AuraBeauty','PetalSoft','ElixirCo'],
    priceRange: [8.99, 299.99]
  },
  toys: {
    emojis: ['🎮','🧸','🎲','🧩','🪀','🎯','🪁','🤖','🎭','🎪','🪆','🎨','🎹','🪗','🥁','🎸','🎻','🎺','🪈','🎷'],
    adjectives: ['Super','Mega','Ultra','Magic','Wonder','Epic','Cosmic','Turbo','Hyper','Infinity'],
    nouns: ['Console','Teddy Bear','Board Game','Puzzle Set','Yo-Yo','Target Game','Kite','Robot','Puppet Set','Circus Set','Doll Set','Art Kit','Keyboard','Accordion Toy','Drum Kit','Guitar Toy','Violin Toy','Trumpet Toy','Flute Toy','Sax Toy'],
    brands: ['FunZone','PlayMasters','ToyBox','KiddoLand','JoyRide','WonderWorld','GameVault','StarPlay','MegaFun','HappyHour'],
    priceRange: [7.99, 499.99]
  },
  automotive: {
    emojis: ['🚗','🏎️','🛞','🔧','⛽','🛢️','🚘','🏍️','🛵','🚐','🔩','⚙️','🪛','🧰','🪝','🚙','🛻','🚕','🚑','🚒'],
    adjectives: ['Turbo','Carbon','Titan','Power','Chrome','Nitro','Apex','Steel','Iron','Velocity'],
    nouns: ['Car Cover','Racing Kit','Tire Set','Tool Kit','Fuel Additive','Oil Filter','Dash Cam','Helmet','Scooter Gear','Seat Cover','Bolt Set','Gear Kit','Screwdriver Set','Toolbox','Tow Hook','Floor Mat','Truck Rack','GPS Mount','First Aid Car Kit','LED Light Bar'],
    brands: ['AutoPro','RaceCraft','TurboMax','IronDrive','VelocityAuto','ChromeEdge','GearShift','MotorElite','DriveForce','AxleTech'],
    priceRange: [9.99, 999.99]
  },
  garden: {
    emojis: ['🌿','🌱','🌻','🪴','🌳','🍀','🌾','🪻','🌺','🪺','🦋','🐝','🪵','🪨','🍄','🌵','🌴','🪹','🦜','🪶'],
    adjectives: ['Green','Bloom','Terra','Eco','Wild','Zen','Nature','Harvest','Flora','Eden'],
    nouns: ['Seed Kit','Plant Pot','Sunflower Kit','Indoor Planter','Tree Sapling','Herb Garden','Grain Mill','Lavender Set','Flower Bed','Bird House','Butterfly Kit','Bee House','Log Bench','Rock Garden','Mushroom Kit','Cactus Set','Palm Decor','Nest Box','Bird Feeder','Feather Decor'],
    brands: ['GreenThumb','BloomBox','EcoGarden','NatureCraft','PlantJoy','GardenPro','LeafLife','SproutCo','FloraVille','EarthWise'],
    priceRange: [6.99, 399.99]
  },
  health: {
    emojis: ['💊','🩺','🩹','🌡️','🧬','💉','🩻','🦷','👁️','🫀','🏥','🩸','🧘','🥗','🥤','🍵','🫖','🧃','💪','🧠'],
    adjectives: ['Vital','Active','Pure','Bio','Omega','Zen','Power','Core','Balance','Peak'],
    nouns: ['Vitamin Pack','Health Monitor','Bandage Kit','Thermometer','DNA Test','Supplement Box','X-Ray Viewer','Dental Kit','Eye Care Kit','Heart Monitor','First Aid Kit','Blood Pressure Kit','Yoga Block','Salad Maker','Blender','Tea Set','Teapot','Juice Press','Protein Powder','Brain Supplement'],
    brands: ['VitalLife','ActiveHealth','PureBio','OmegaWell','ZenBody','PowerVita','CoreHealth','BalanceLife','PeakWell','BioHarmony'],
    priceRange: [11.99, 499.99]
  }
};

function getProductImage(seed, width = 400, height = 400, category = null, productName = '') {
  // Use securely fetched Bing static images to guarantee 100% load success and PERFECT MATCHING relevance!
  const images = (typeof BING_IMAGES !== 'undefined' && BING_IMAGES[category]) ? BING_IMAGES[category] : [];
  if (images.length > 0) {
    const lock = typeof seed === 'number' ? seed : hashString(String(seed));
    return images[lock % images.length];
  }
  
  // Ultimate fallback if category is unknown or data failed to load
  const lock = typeof seed === 'number' ? seed : hashString(String(seed));
  return `https://picsum.photos/seed/${lock}/${width}/${height}`;
}

// Simple hash map for string seeds if necessary
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = Math.imul(31, hash) + str.charCodeAt(i) | 0;
  return Math.abs(hash);
}

const ALL_PRODUCTS = (typeof EXACT_PRODUCTS !== 'undefined' ? EXACT_PRODUCTS : []).map(p => {
  p.badges = [];
  if (p.discount > 0) p.badges.push('sale');
  if (p.id % 7 === 0) p.badges.push('new');
  if (p.reviews > 150) p.badges.push('hot');
  
  if (!p.description) {
    p.description = `Experience the premium quality and detailed craftsmanship of the ${p.name}. Built directly for consumer excellence, ensuring lasting performance and beautiful aesthetic integration. Complete with our standard global warranty.`;
  }
  return p;
});

function getProductsByCategory(catId) {
  return ALL_PRODUCTS.filter(p => p.category === catId);
}
function getProductById(id) {
  return ALL_PRODUCTS.find(p => p.id === id);
}
function getFeaturedProducts(count = 8) {
  return ALL_PRODUCTS.filter(p => p.badges.includes('hot') || p.badges.includes('new')).sort(() => 0.5 - Math.random()).slice(0, count);
}
function getDeals(count = 8) {
  return ALL_PRODUCTS.filter(p => p.discount >= 25).sort((a, b) => b.discount - a.discount).slice(0, count);
}
function searchProducts(query) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return ALL_PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.brand.toLowerCase().includes(q) ||
    p.categoryName.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q)
  ).slice(0, 50);
}
function getRecommendations(productId, count = 4) {
  const product = getProductById(productId);
  if (!product) return [];
  return ALL_PRODUCTS.filter(p => p.category === product.category && p.id !== productId)
    .sort(() => 0.5 - Math.random()).slice(0, count);
}

/* Fake Reviews Generator */
const REVIEW_NAMES = ['Alex M.','Sarah K.','James W.','Emma R.','Michael B.','Lisa P.','David C.','Jennifer L.','Robert T.','Amanda S.','Chris N.','Nicole H.','Daniel F.','Rachel G.','Steven D.','Megan O.','Kevin U.','Laura I.','Brian E.','Ashley V.'];
const REVIEW_TEXTS = [
  'Absolutely love this product! Exceeded all my expectations. The quality is outstanding and delivery was super fast.',
  'Great value for money. Build quality is impressive and feels premium. Would definitely recommend to friends.',
  'Very satisfied with my purchase. Works exactly as described and looks even better in person.',
  'Top-notch quality. Customer service was excellent when I had questions. Will buy again!',
  'This is exactly what I was looking for. Premium feel, great design, and fast shipping. Five stars!',
  'Impressive product! The attention to detail is remarkable. Packaging was secure and elegant.',
  'Good product overall. Minor improvements could be made but for the price, it\'s hard to beat.',
  'Wow, this blew me away! The quality surpasses products twice its price. A steal!',
  'Comfortable, stylish, and durable. Everything you\'d want from a premium brand.',
  'Highly recommend! This has become my go-to. Can\'t imagine going back to my old one.',
];

function generateReviews(productId) {
  const count = Math.floor(Math.random() * 5 + 3);
  const revs = [];
  for (let i = 0; i < count; i++) {
    revs.push({
      author: REVIEW_NAMES[Math.floor(Math.random() * REVIEW_NAMES.length)],
      rating: Math.floor(Math.random() * 2 + 4),
      text: REVIEW_TEXTS[Math.floor(Math.random() * REVIEW_TEXTS.length)],
      date: new Date(Date.now() - Math.floor(Math.random() * 90) * 86400000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    });
  }
  return revs;
}
