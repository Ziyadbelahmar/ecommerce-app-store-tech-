const mongoose = require("mongoose");
const Product = require("./models/Product");

mongoose.connect("mongodb://localhost:27017/ecommerce_db")
  .then(() => console.log("✅ MongoDB connecté"))
  .catch(err => console.log("❌ Erreur MongoDB:", err));

const products = [
  // SMARTPHONES
  {
    name: "iPhone 16 Pro 128GB",
    description: "The latest iPhone with A18 Pro chip, advanced camera system with 48MP main sensor, and ProMotion display with 120Hz refresh rate.",
    price: 1130,
    originalPrice: 1299,
    brand: "APPLE",
    category: "Smartphones",
    subcategory: "iPhone",
    images: ["https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=500"],
    specifications: {
      screen: "6.3-inch OLED ProMotion",
      processor: "A18 Pro",
      ram: "8GB",
      storage: "128GB",
      camera: "48MP + 12MP + 12MP",
      battery: "3274 mAh",
      os: "iOS 18"
    },
    colors: [
      { name: "Natural Titanium", hex: "#e5e5e0" },
      { name: "Blue Titanium", hex: "#3f4e5f" },
      { name: "White Titanium", hex: "#f5f5f0" },
      { name: "Black Titanium", hex: "#2d2d2d" }
    ],
    stock: 45,
    rating: 4.8,
    reviewsCount: 342,
    featured: true,
    onSale: true,
    salePercentage: 15
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    description: "Flagship Android phone with S Pen, 200MP camera, and powerful Snapdragon 8 Gen 3 processor.",
    price: 1199,
    originalPrice: null,
    brand: "SAMSUNG",
    category: "Smartphones",
    subcategory: "Galaxy",
    images: ["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500"],
    specifications: {
      screen: "6.8-inch Dynamic AMOLED 2X",
      processor: "Snapdragon 8 Gen 3",
      ram: "12GB",
      storage: "256GB",
      camera: "200MP + 50MP + 12MP + 10MP",
      battery: "5000 mAh",
      os: "Android 14"
    },
    colors: [
      { name: "Titanium Gray", hex: "#737373" },
      { name: "Titanium Black", hex: "#1a1a1a" },
      { name: "Titanium Violet", hex: "#8b7b9e" }
    ],
    stock: 32,
    rating: 4.7,
    reviewsCount: 218,
    featured: true,
    onSale: false,
    salePercentage: 0
  },
  {
    name: "Google Pixel 9 Pro",
    description: "Pure Android experience with Google Tensor G4 chip and advanced AI photography features.",
    price: 999,
    originalPrice: null,
    brand: "GOOGLE",
    category: "Smartphones",
    subcategory: "Pixel",
    images: ["https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500"],
    specifications: {
      screen: "6.7-inch LTPO OLED",
      processor: "Google Tensor G4",
      ram: "12GB",
      storage: "128GB",
      camera: "50MP + 48MP + 48MP",
      battery: "5050 mAh",
      os: "Android 15"
    },
    colors: [
      { name: "Obsidian", hex: "#1a1a1a" },
      { name: "Porcelain", hex: "#f5f5f0" },
      { name: "Bay", hex: "#7cb5c9" }
    ],
    stock: 28,
    rating: 4.6,
    reviewsCount: 156,
    featured: false,
    onSale: false,
    salePercentage: 0
  },

  // LAPTOPS
  {
    name: "MacBook Pro 14\" M4",
    description: "Powerful laptop with M4 chip, Liquid Retina XDR display, and up to 24 hours battery life.",
    price: 1999,
    originalPrice: null,
    brand: "APPLE",
    category: "Laptops",
    subcategory: "MacBook",
    images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500"],
    specifications: {
      screen: "14.2-inch Liquid Retina XDR",
      processor: "Apple M4",
      ram: "16GB",
      storage: "512GB SSD",
      camera: "1080p FaceTime HD",
      battery: "70 Wh",
      os: "macOS Sequoia"
    },
    colors: [
      { name: "Space Black", hex: "#2d2d2d" },
      { name: "Silver", hex: "#e5e5e5" }
    ],
    stock: 18,
    rating: 4.9,
    reviewsCount: 421,
    featured: true,
    onSale: false,
    salePercentage: 0
  },
  {
    name: "Dell XPS 15",
    description: "Premium Windows laptop with stunning InfinityEdge display and powerful Intel Core i7 processor.",
    price: 1799,
    originalPrice: 1999,
    brand: "DELL",
    category: "Laptops",
    subcategory: "XPS",
    images: ["https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500"],
    specifications: {
      screen: "15.6-inch OLED 3.5K",
      processor: "Intel Core i7-13700H",
      ram: "16GB",
      storage: "512GB SSD",
      camera: "720p HD",
      battery: "86 Wh",
      os: "Windows 11 Pro"
    },
    colors: [
      { name: "Platinum Silver", hex: "#d4d4d4" },
      { name: "Graphite", hex: "#3d3d3d" }
    ],
    stock: 12,
    rating: 4.5,
    reviewsCount: 189,
    featured: false,
    onSale: true,
    salePercentage: 10
  },
  {
    name: "HP Spectre x360 14",
    description: "Convertible 2-in-1 laptop with gem-cut design and vibrant OLED touchscreen.",
    price: 1599,
    originalPrice: null,
    brand: "HP",
    category: "Laptops",
    subcategory: "Spectre",
    images: ["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500"],
    specifications: {
      screen: "13.5-inch OLED 3K2K Touch",
      processor: "Intel Core i7-1355U",
      ram: "16GB",
      storage: "1TB SSD",
      camera: "1080p IR",
      battery: "66 Wh",
      os: "Windows 11 Home"
    },
    colors: [
      { name: "Nightfall Black", hex: "#1a1a1a" },
      { name: "Nocturne Blue", hex: "#2c3e50" }
    ],
    stock: 9,
    rating: 4.4,
    reviewsCount: 127,
    featured: false,
    onSale: false,
    salePercentage: 0
  },

  // AUDIO
  {
    name: "AirPods Max",
    description: "Premium over-ear headphones with Active Noise Cancellation, spatial audio, and seamless Apple integration.",
    price: 549,
    originalPrice: null,
    brand: "APPLE",
    category: "Audio",
    subcategory: "Headphones",
    images: ["https://images.unsplash.com/photo-1625738183097-e2e3f0c3e5e5?w=500"],
    specifications: {
      battery: "20 hours ANC",
      os: "iOS/macOS compatible"
    },
    colors: [
      { name: "Space Gray", hex: "#4a4a4a" },
      { name: "Silver", hex: "#e5e5e5" },
      { name: "Sky Blue", hex: "#7cb5c9" },
      { name: "Pink", hex: "#f5c6cb" },
      { name: "Green", hex: "#a8c5a1" }
    ],
    stock: 35,
    rating: 4.7,
    reviewsCount: 892,
    featured: true,
    onSale: false,
    salePercentage: 0
  },
  {
    name: "Sony WH-1000XM5",
    description: "Industry-leading noise canceling headphones with exceptional sound quality and 30-hour battery life.",
    price: 399,
    originalPrice: 449,
    brand: "SONY",
    category: "Audio",
    subcategory: "Headphones",
    images: ["https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500"],
    specifications: {
      battery: "30 hours ANC"
    },
    colors: [
      { name: "Black", hex: "#1a1a1a" },
      { name: "Silver", hex: "#c0c0c0" }
    ],
    stock: 42,
    rating: 4.8,
    reviewsCount: 1247,
    featured: true,
    onSale: true,
    salePercentage: 11
  },
  {
    name: "Bose QuietComfort Ultra",
    description: "Premium wireless headphones with world-class noise cancellation and immersive audio.",
    price: 429,
    originalPrice: null,
    brand: "BOSE",
    category: "Audio",
    subcategory: "Headphones",
    images: ["https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500"],
    specifications: {
      battery: "24 hours ANC"
    },
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "White Smoke", hex: "#f5f5f5" },
      { name: "Moonstone Blue", hex: "#5f7a8f" }
    ],
    stock: 27,
    rating: 4.6,
    reviewsCount: 634,
    featured: false,
    onSale: false,
    salePercentage: 0
  },

  // TABLETS
  {
    name: "iPad Pro 12.9\" M4",
    description: "The ultimate iPad with M4 chip, stunning Liquid Retina XDR display, and Apple Pencil Pro support.",
    price: 1299,
    originalPrice: null,
    brand: "APPLE",
    category: "Tablets",
    subcategory: "iPad",
    images: ["https://images.unsplash.com/photo-1585790050230-5dd28404f9ae?w=500"],
    specifications: {
      screen: "12.9-inch Liquid Retina XDR",
      processor: "Apple M4",
      ram: "8GB",
      storage: "256GB",
      camera: "12MP Wide + 10MP Ultra Wide",
      battery: "40.88 Wh",
      os: "iPadOS 18"
    },
    colors: [
      { name: "Space Gray", hex: "#4a4a4a" },
      { name: "Silver", hex: "#e5e5e5" }
    ],
    stock: 22,
    rating: 4.9,
    reviewsCount: 512,
    featured: true,
    onSale: false,
    salePercentage: 0
  },
  {
    name: "Samsung Galaxy Tab S9 Ultra",
    description: "Massive 14.6-inch AMOLED display with S Pen included, perfect for productivity and creativity.",
    price: 1199,
    originalPrice: 1349,
    brand: "SAMSUNG",
    category: "Tablets",
    subcategory: "Galaxy Tab",
    images: ["https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500"],
    specifications: {
      screen: "14.6-inch Dynamic AMOLED 2X",
      processor: "Snapdragon 8 Gen 2",
      ram: "12GB",
      storage: "256GB",
      camera: "13MP + 8MP",
      battery: "11200 mAh",
      os: "Android 14"
    },
    colors: [
      { name: "Graphite", hex: "#3d3d3d" },
      { name: "Beige", hex: "#d4c5b0" }
    ],
    stock: 15,
    rating: 4.7,
    reviewsCount: 284,
    featured: false,
    onSale: true,
    salePercentage: 12
  },

  // ACCESSORIES
  {
    name: "Apple Watch Series 10",
    description: "Advanced health and fitness tracking with Always-On Retina display and comprehensive workout modes.",
    price: 429,
    originalPrice: null,
    brand: "APPLE",
    category: "Accessories",
    subcategory: "Smartwatch",
    images: ["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500"],
    specifications: {
      screen: "1.9-inch Always-On Retina",
      battery: "18 hours",
      os: "watchOS 11"
    },
    colors: [
      { name: "Midnight Aluminum", hex: "#1a1a1a" },
      { name: "Starlight Aluminum", hex: "#f5f5f0" },
      { name: "Silver Aluminum", hex: "#e5e5e5" }
    ],
    stock: 68,
    rating: 4.8,
    reviewsCount: 1823,
    featured: true,
    onSale: false,
    salePercentage: 0
  },
  {
    name: "AirPods Pro (2nd Gen)",
    description: "Wireless earbuds with Active Noise Cancellation, Transparency mode, and USB-C charging.",
    price: 249,
    originalPrice: null,
    brand: "APPLE",
    category: "Accessories",
    subcategory: "Earbuds",
    images: ["https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=500"],
    specifications: {
      battery: "6 hours (ANC on), 30 hours with case"
    },
    colors: [
      { name: "White", hex: "#ffffff" }
    ],
    stock: 124,
    rating: 4.9,
    reviewsCount: 2847,
    featured: true,
    onSale: false,
    salePercentage: 0
  }
];

const seedDatabase = async () => {
  try {
    await Product.deleteMany({});
    console.log("🗑️  Anciens produits supprimés");
    
    await Product.insertMany(products);
    console.log(`✅ ${products.length} produits ajoutés avec succès !`);
    
    process.exit();
  } catch (error) {
    console.error("❌ Erreur:", error);
    process.exit(1);
  }
};

seedDatabase();
