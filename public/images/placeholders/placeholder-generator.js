// ========================================
// MASTROHUB PLACEHOLDER IMAGE GENERATOR
// ========================================
// This utility generates placeholder images for development
// Run this in browser console to create placeholder images

function generatePlaceholderImage(width, height, text, filename) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#dc2626");
  gradient.addColorStop(1, "#ea580c");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Text
  ctx.fillStyle = "white";
  ctx.font = `${Math.min(width, height) / 10}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, width / 2, height / 2);

  // Download
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL();
  link.click();
}

// Generate all required placeholder images
const placeholders = [
  {
    width: 800,
    height: 600,
    text: "Hero Gastronomy",
    filename: "hero-gastronomy.jpg",
  },
  {
    width: 800,
    height: 600,
    text: "Molecular Gastronomy",
    filename: "molecular-gastronomy.jpg",
  },
  {
    width: 800,
    height: 600,
    text: "Sustainable Dining",
    filename: "sustainable-dining.jpg",
  },
  {
    width: 800,
    height: 600,
    text: "Wine Pairing",
    filename: "wine-pairing.jpg",
  },
  { width: 800, height: 600, text: "Street Food", filename: "street-food.jpg" },
  {
    width: 800,
    height: 600,
    text: "Luxury Hotel",
    filename: "luxury-hotel.jpg",
  },
  { width: 800, height: 600, text: "Chef Elena", filename: "chef-elena.jpg" },
  { width: 150, height: 150, text: "Chef Marco", filename: "chef-marco.jpg" },
  { width: 150, height: 150, text: "Sarah Chen", filename: "sarah-chen.jpg" },
  {
    width: 150,
    height: 150,
    text: "Pierre Dubois",
    filename: "pierre-dubois.jpg",
  },
  {
    width: 150,
    height: 150,
    text: "Maria Gonzalez",
    filename: "maria-gonzalez.jpg",
  },
  {
    width: 150,
    height: 150,
    text: "James Thompson",
    filename: "james-thompson.jpg",
  },
  { width: 150, height: 150, text: "David Kim", filename: "david-kim.jpg" },
  {
    width: 150,
    height: 150,
    text: "Avatar Default",
    filename: "avatar-default.jpg",
  },
];

// Generate all placeholders
placeholders.forEach((placeholder) => {
  generatePlaceholderImage(
    placeholder.width,
    placeholder.height,
    placeholder.text,
    placeholder.filename
  );
});

console.log("✅ All placeholder images generated!");
console.log("📁 Check your Downloads folder for the generated images");
console.log("🔄 Copy them to public/images/placeholders/ directory");

