import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Globe, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

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

const ArticleHeader = ({ article }: { article: ArticleState }) => (
  <div className="space-y-4 mb-8">
    <Button
      variant="ghost"
      size="sm"
      className="mb-4"
      onClick={() => window.history.back()}
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to News
    </Button>
    
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Clock className="h-4 w-4" />
      <time dateTime={article.publishedAt}>
        {format(new Date(article.publishedAt), "MMMM d, yyyy")}
      </time>
      <span>•</span>
      <Globe className="h-4 w-4" />
      <span>{article.source.name}</span>
    </div>
    
    <h1 className="text-4xl md:text-5xl font-serif leading-tight">{article.title}</h1>
    
    <p className="text-xl text-muted-foreground leading-relaxed">
      {article.description}
    </p>
  </div>
);

const ArticleImage = ({ article }: { article: ArticleState }) => (
  article.urlToImage && (
    <div className="relative aspect-[16/9] mb-12 rounded-lg overflow-hidden">
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
  )
);

const ShareButton = ({ url, title }: { url: string; title: string }) => (
  <Button
    variant="outline"
    size="sm"
    onClick={() => {
      if (navigator.share) {
        navigator.share({
          title: title,
          url: url
        });
      } else {
        navigator.clipboard.writeText(url);
      }
    }}
  >
    <Share2 className="h-4 w-4 mr-2" />
    Share Article
  </Button>
);

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
      <article className="container max-w-4xl mx-auto px-4 py-12">
        <ArticleHeader article={article} />
        <ArticleImage article={article} />

        <div className="flex justify-between items-center mb-8">
          <ShareButton url={article.url} title={article.title} />
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            View Original Article
          </a>
        </div>

        <Separator className="mb-8" />

        <div className={cn(
          "prose prose-lg dark:prose-invert max-w-none",
          "prose-headings:font-serif prose-headings:font-normal",
          "prose-p:leading-relaxed prose-p:text-balance",
          "prose-img:rounded-lg",
          "prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
        )}>
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : error ? (
            <div className="text-lg leading-relaxed">{article.description}</div>
          ) : (
            <div>
              {fullArticle?.body ? (
                <div dangerouslySetInnerHTML={{ 
                  __html: fullArticle.body.replace(
                    /<p>/g, 
                    '<p class="text-lg leading-relaxed mb-6">'
                  )
                }} />
              ) : (
                <div className="text-lg leading-relaxed">{article.description}</div>
              )}
            </div>
          )}
        </div>
      </article>
    </div>
  );
};

export default Article;
