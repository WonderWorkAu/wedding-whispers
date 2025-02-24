import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { useNavigate } from 'react-router-dom';

interface FeaturedNewsProps {
  article: {
    title: string;
    description: string;
    urlToImage: string | null;
    url: string;
    publishedAt: string;
    source: { name: string };
    body?: string;
  };
}

export const FeaturedNews = ({ article }: FeaturedNewsProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/article', {
      state: article
    });
  };

  return (
    <div 
      onClick={handleClick}
      className="group relative overflow-hidden rounded-lg cursor-pointer"
    >
      <div className="relative h-[60vh] w-full">
        {article.urlToImage ? (
          <img
            src={article.urlToImage}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">No image available</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-background/20" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <div className="max-w-3xl">
          <div className="text-sm text-white/90 mb-3">
            {format(new Date(article.publishedAt), "MMM dd, yyyy")} • {article.source.name}
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-white mb-4">
            {article.title}
          </h2>
          <p className="text-white/90 line-clamp-2 md:line-clamp-3">
            {article.description}
          </p>
        </div>
      </div>
    </div>
  );
};
