import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

interface ArticleState {
  title: string;
  description: string;
  publishedAt: string;
  urlToImage: string | null;
  source: { name: string };
  url: string;
  uri: string;
}

const API_KEY = "bfbdfc07-da15-462c-8bb9-64204801921c";

const fetchFullArticle = async (uri: string) => {
  const response = await fetch(
    'https://eventregistry.org/api/v1/article/getArticle',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        action: "getArticle",
        articleUri: uri,
        infoArticleBodyLen: -1,
        resultType: "info",
        apiKey: API_KEY
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch full article');
  }

  const data = await response.json();
  return data.info;
};

const Article = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const article = location.state as ArticleState;

  const { data: fullArticle, isLoading, error } = useQuery({
    queryKey: ['article', article?.uri],
    queryFn: () => fetchFullArticle(article?.uri),
    enabled: !!article?.uri,
  });

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Article not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to News
        </Button>

        {article.urlToImage && (
          <div className="relative h-[400px] w-full mb-8 rounded-lg overflow-hidden">
            <img
              src={article.urlToImage}
              alt={article.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
              }}
            />
          </div>
        )}

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="font-serif mb-4">{article.title}</h1>
          
          <div className="flex items-center gap-2 text-muted-foreground mb-8">
            <span>{format(new Date(article.publishedAt), "MMM dd, yyyy")}</span>
            <span>•</span>
            <span>{article.source.name}</span>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : error ? (
            <div className="text-lg leading-relaxed">{article.description}</div>
          ) : (
            <div className="space-y-4">
              {fullArticle?.body ? (
                <div className="mt-8" dangerouslySetInnerHTML={{ __html: fullArticle.body }} />
              ) : (
                <div className="text-lg leading-relaxed">{article.description}</div>
              )}
            </div>
          )}

          <div className="mt-8 pt-8 border-t">
            <p className="text-sm text-muted-foreground">
              Original article available at:{" "}
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {article.source.name}
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Article;
