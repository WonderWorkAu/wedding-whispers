import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { NewsCard } from "@/components/NewsCard";
import { FeaturedNews } from "@/components/FeaturedNews";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_KEY = "ddb1e9326c8cdb699171fba8b76e2522b9afd34ce03922635bff94d557057484";

interface Article {
  title: string;
  description: string;
  publishedAt: string;
  urlToImage: string | null;
  source: { name: string };
  url: string;
  uri?: string;
  body?: string;
}

const fetchNews = async (searchQuery: string = "luxury wedding") => {
  try {
    console.log('Fetching news...');
    const params = new URLSearchParams({
      api_key: API_KEY,
      q: `${searchQuery} (wedding OR bridal OR "luxury wedding" OR "destination wedding")`,
      engine: "google_news",
      gl: "us",
      hl: "en",
      num: "12"
    });

    const response = await fetch(
      `/api/news?${params.toString()}`,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('API Response:', data);

    if (!response.ok) {
      throw new Error(`Failed to fetch news: ${response.status}`);
    }

    if (data.error) {
      throw new Error(data.error);
    }

    const articles = data.news_results || [];
    console.log('Processed articles:', articles);
    
    return articles.map((article: any) => ({
      title: article.title || 'No title available',
      description: article.snippet || 'No description available',
      publishedAt: article.date || new Date().toISOString(),
      urlToImage: article.thumbnail || article.thumbnail_small || null,
      source: { 
        name: article.source?.name || article.source?.title || 'Unknown Source'
      },
      url: article.link || '#',
      uri: article.story_token || '',
      body: article.snippet || 'No content available'
    }));
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("luxury wedding");
  const { toast } = useToast();
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["news", searchQuery],
    queryFn: () => fetchNews(searchQuery),
    refetchInterval: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 60,
    retry: 3,
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch wedding news",
        variant: "destructive",
      });
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Unable to load wedding news at this time. Please try again later.</p>
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
            {data?.[0] && <FeaturedNews article={data[0]} />}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {data?.slice(1).map((article: Article) => (
                <NewsCard
                  key={article.title}
                  article={article}
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
