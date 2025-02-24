import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { NewsCard } from "@/components/NewsCard";
import { FeaturedNews } from "@/components/FeaturedNews";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, subDays } from 'date-fns';

const API_KEY = "bfbdfc07-da15-462c-8bb9-64204801921c";

interface NewsArticle {
  title: string;
  description: string;
  publishedAt: string;
  urlToImage: string | null;
  source: { name: string };
  url: string;
  uri: string;
  body: string;
}

const fetchNews = async () => {
  try {
    console.log('Fetching news...');
    const response = await fetch(
      'https://eventregistry.org/api/v1/article/getArticles',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          action: "getArticles",
          keyword: [
            // Wedding related
            "wedding", "bridal", "marriage ceremony", "wedding planning",
            "wedding trends", "wedding fashion", "wedding design",
            
            // Luxury & Lifestyle
            "luxury lifestyle", "luxury events", "luxury travel",
            "luxury fashion", "high-end", "luxury experience",
            "luxury celebration", "luxury venue",
            
            // Celebrations & Events
            "celebration", "special events", "event planning",
            "destination events", "luxury celebration",
            
            // Travel & Destinations
            "destination wedding", "honeymoon destination",
            "luxury destination", "travel experience",
            
            // Fashion & Style
            "bridal fashion", "luxury fashion", "designer wedding",
            "couture", "fashion trends"
          ],
          keywordOper: "or",
          categoryUri: [
            "news/Society/Lifestyle",
            "news/Society/Family",
            "news/Business/Industries/Tourism",
            "news/Arts_and_Entertainment/Fashion",
            "news/Lifestyle/Food_and_Dining"
          ],
          lang: "eng",
          articlesPage: 1,
          articlesCount: 12,
          articlesSortBy: "date",
          articlesSortByAsc: false,
          resultType: "articles",
          dataType: ["news", "blog"],
          apiKey: API_KEY,
          ignoreKeyword: [
            "divorce", "breakup", "scandal", "controversy",
            "budget wedding", "cheap", "affordable", "low-cost"
          ],
          dateStart: format(subDays(new Date(), 90), 'yyyy-MM-dd'), // Last 90 days
          dateEnd: format(new Date(), 'yyyy-MM-dd')
        }),
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

    const articles = data.articles?.results || [];
    console.log('Processed articles:', articles);
    
    return articles.map((article: any) => ({
      title: article.title || 'No title available',
      description: article.body || article.description || 'No description available',
      publishedAt: article.dateTime || article.date || new Date().toISOString(),
      urlToImage: article.image || null,
      source: { name: article.source?.title || 'Unknown Source' },
      url: article.url || '#',
      uri: article.uri || '',
      body: article.body || article.description || ''
    }));
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("wedding");
  const { toast } = useToast();
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["news"],
    queryFn: fetchNews,
    refetchInterval: 1000 * 60 * 60,
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
              {data?.slice(1).map((article: NewsArticle) => (
                <NewsCard
                  key={article.title}
                  title={article.title}
                  description={article.description}
                  publishedAt={article.publishedAt}
                  urlToImage={article.urlToImage}
                  source={article.source.name}
                  url={article.url}
                  uri={article.uri}
                  body={article.body}
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
