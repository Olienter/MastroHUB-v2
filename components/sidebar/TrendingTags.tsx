export function TrendingTags() {
  const trendingTags = [
    "Slovak Cuisine",
    "Wine Culture",
    "Modern Gastronomy",
    "Food Innovation",
    "Culinary Heritage",
    "Sustainable Food",
    "Chef Interviews",
    "Restaurant Reviews"
  ];

  return (
    <div className="bg-white p-4 rounded-lg border">
      <h3 className="font-semibold text-gray-900 mb-3">Trending Topics</h3>
      <div className="flex flex-wrap gap-2">
        {trendingTags.map((tag) => (
          <button
            key={tag}
            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
