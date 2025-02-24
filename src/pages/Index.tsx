
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { NewsCard } from "@/components/NewsCard";
import { FeaturedNews } from "@/components/FeaturedNews";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const API_KEY = "f9f8ac8809a140818588f770f239a84c";

interface NewsArticle {
  title: string;
  description: string;
  publishedAt: string;
  urlToImage: string | null;
  source: { name: string };
  url: string;
}

const fetchWeddingNews = async (searchQuery: string = "wedding") => {
  const today = new Date().toISOString().split('T')[0];
  const response = await fetch(
    `https://newsapi.org/v2/everything?` + 
    `q=${encodeURIComponent(searchQuery)}` +
    `&from=${today}` +
    `&sortBy=popularity` +
    `&pageSize=13` +
    `&language=en` +
    `&apiKey=${API_KEY}`,
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch news");
  }
  
  return data;
};

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("wedding");
  const { toast } = useToast();
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["news", searchQuery],
    queryFn: () => fetchWeddingNews(searchQuery),
    refetchInterval: 1000 * 60 * 60, // Refetch every hour
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Unable to load wedding news at this time. The NewsAPI free tier only works on localhost during development.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Wedded Wonderland</h1>
          <p className="text-muted-foreground mb-8">Your Daily Source for Wedding News & Inspiration</p>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-2">
            <Input
              type="text"
              placeholder="Search wedding news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
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

