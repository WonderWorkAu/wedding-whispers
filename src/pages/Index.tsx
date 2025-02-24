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
  const response = await fetch(
    'https://eventregistry.org/api/v1/article/getArticles',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: "getArticles",
        keyword: ["wedding", "marriage ceremony", "bridal", "wedding planning", "wedding trends"],
        keywordOper: "or",
        categoryUri: ["news/Society/Lifestyle", "news/Society/Family"],
        lang: "eng",
        articlesPage: 1,
        articlesCount: 12,
        articlesSortBy: "date",
        articlesSortByAsc: false,
        articlesArticleBodyLen: -1,
        resultType: "articles",
        dataType: ["news", "blog"],
        apiKey: API_KEY,
        ignoreKeyword: ["divorce", "breakup", "scandal"],
        dateStart: format(subDays(new Date(), 30), 'yyyy-MM-dd'), // Last 30 days
        dateEnd: format(new Date(), 'yyyy-MM-dd')
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch news');
  }

  const data = await response.json();
  return data.articles?.results || [];
};

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("wedding");
  const { toast } = useToast();
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["news"],
    queryFn: fetchNews,
    refetchInterval: 1000 * 60 * 60, // Refetch every hour
    retry: 3,
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
