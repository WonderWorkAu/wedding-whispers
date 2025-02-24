import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Globe, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ArticleState {
  title: string;
  description: string;
  publishedAt: string;
  urlToImage: string | null;
  source: { name: string };
  url: string;
}

const fetchArticleContent = async (url: string) => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    const response = await fetch(`${apiUrl}/api/article?url=${encodeURIComponent(url)}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || 'Failed to fetch article content');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching article:', error);
    throw error;
  }
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Recent';
  
  try {
    let date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return format(date, 'MMMM d, yyyy');
    }
    
    const timeAgoMatch = dateString.match(/(\d+)\s+(hour|day|week|month|year)s?\s+ago/i);
    if (timeAgoMatch) {
      const [_, amount, unit] = timeAgoMatch;
      const now = new Date();
      switch(unit.toLowerCase()) {
        case 'hour':
          now.setHours(now.getHours() - parseInt(amount));
          break;
        case 'day':
          now.setDate(now.getDate() - parseInt(amount));
          break;
        case 'week':
          now.setDate(now.getDate() - (parseInt(amount) * 7));
          break;
        case 'month':
          now.setMonth(now.getMonth() - parseInt(amount));
          break;
        case 'year':
          now.setFullYear(now.getFullYear() - parseInt(amount));
          break;
      }
      return format(now, 'MMMM d, yyyy');
    }

    return 'Recent';
  } catch (error) {
    console.error('Date parsing error:', error);
    return 'Recent';
  }
};

const Article = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const article = location.state as ArticleState;

  const { data: fullArticle, isLoading } = useQuery({
    queryKey: ['article', article?.url],
    queryFn: () => fetchArticleContent(article?.url),
    enabled: !!article?.url,
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
        <div className="space-y-8 mb-12">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to News
          </Button>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <time dateTime={article.publishedAt}>
                {formatDate(article.publishedAt)}
              </time>
              <span>•</span>
              <Globe className="h-4 w-4" />
              <span>{article.source.name}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-serif leading-tight">
              {article.title}
            </h1>

            {article.urlToImage && (
              <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-muted">
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
          </div>
        </div>

        <div className="space-y-8">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : fullArticle ? (
            <div 
              className={cn(
                "prose prose-lg dark:prose-invert max-w-none",
                "prose-headings:font-serif prose-headings:font-normal",
                "prose-p:leading-relaxed prose-p:text-balance",
                "prose-img:rounded-lg",
                "prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
              )}
              dangerouslySetInnerHTML={{ __html: fullArticle.content }}
            />
          ) : (
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-lg leading-relaxed">{article.description}</p>
            </div>
          )}

          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: article.title,
                    url: article.url
                  });
                } else {
                  navigator.clipboard.writeText(article.url);
                }
              }}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Article
            </Button>
          </div>
        </div>
      </article>
    </div>
  );
};

export default Article;
