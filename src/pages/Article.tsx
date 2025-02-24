import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ArticleState {
  title: string;
  description: string;
  publishedAt: string;
  urlToImage: string | null;
  source: { name: string };
  url: string;
  body?: string;
}

const Article = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const article = location.state as ArticleState;

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

          <div className="space-y-4">
            <p className="text-lg leading-relaxed">{article.description}</p>
            {article.body && (
              <div className="mt-8" dangerouslySetInnerHTML={{ __html: article.body }} />
            )}
          </div>

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
