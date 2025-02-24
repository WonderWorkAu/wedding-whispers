
import { useQuery } from "@tanstack/react-query";
import { NewsCard } from "@/components/NewsCard";
import { FeaturedNews } from "@/components/FeaturedNews";
import { Skeleton } from "@/components/ui/skeleton";

const API_KEY = "f9f8ac8809a140818588f770f239a84c";

interface NewsArticle {
  title: string;
  description: string;
  publishedAt: string;
  urlToImage: string | null;
  source: { name: string };
  url: string;
}

const fetchWeddingNews = async () => {
  const response = await fetch(
    `https://newsapi.org/v2/everything?q=wedding&apiKey=${API_KEY}&pageSize=13&language=en&sortBy=publishedAt`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const Index = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["weddingNews"],
    queryFn: fetchWeddingNews,
    refetchInterval: 1000 * 60 * 60, // Refetch every hour
  });

  if (error) {
    console.error("Error fetching news:", error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Unable to load wedding news at this time.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Wedded Wonderland</h1>
          <p className="text-muted-foreground">Your Daily Source for Wedding News & Inspiration</p>
        </header>

        {isLoading ? (
          <div className="space-y-8">
            <Skeleton className="w-full h-[60vh] rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-96 rounded-lg" />
              ))}
            </div>
          </div>
        ) : (
          <>
            {data?.articles?.[0] && <FeaturedNews article={data.articles[0]} />}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {data?.articles?.slice(1).map((article: NewsArticle) => (
                <NewsCard
                  key={article.title}
                  title={article.title}
                  description={article.description}
                  publishedAt={article.publishedAt}
                  urlToImage={article.urlToImage}
                  source={article.source.name}
                  url={article.url}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
