export function LiveNewsSidebar() {
  const liveNews = [
    {
      id: 1,
      title: "New AI-Generated Recipe: Traditional Slovak Dumplings",
      time: "2 min ago",
      category: "Recipes"
    },
    {
      id: 2,
      title: "Wine Expert Interview: Slovak Wine Regions",
      time: "15 min ago",
      category: "Wine & Beverages"
    },
    {
      id: 3,
      title: "Restaurant Review: Modern Slovak Cuisine in Bratislava",
      time: "1 hour ago",
      category: "Restaurant Reviews"
    }
  ];

  return (
    <div className="bg-white p-4 rounded-lg border">
      <h3 className="font-semibold text-gray-900 mb-3">Live News Feed</h3>
      <div className="space-y-3">
        {liveNews.map((news) => (
          <div key={news.id} className="border-l-4 border-blue-500 pl-3">
            <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
              {news.title}
            </h4>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {news.category}
              </span>
              <span className="text-xs text-gray-500">{news.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
