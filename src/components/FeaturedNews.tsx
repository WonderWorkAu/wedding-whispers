
import { Card, CardContent } from "@/components/ui/card";

interface FeaturedNewsProps {
  article: {
    title: string;
    description: string;
    urlToImage: string | null;
    url: string;
  };
}

export const FeaturedNews = ({ article }: FeaturedNewsProps) => {
  return (
    <a href={article.url} target="_blank" rel="noopener noreferrer" className="block">
      <Card className="relative overflow-hidden group">
        {article.urlToImage && (
          <div className="relative h-[60vh] overflow-hidden">
            <div className="absolute inset-0 bg-black/40 z-10" />
            <img
              src={article.urlToImage}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
              }}
            />
            <CardContent className="absolute bottom-0 left-0 right-0 z-20 text-white p-8">
              <h1 className="text-4xl md:text-5xl font-serif mb-4 leading-tight">{article.title}</h1>
              <p className="text-lg md:text-xl text-gray-200 line-clamp-2">{article.description}</p>
            </CardContent>
          </div>
        )}
      </Card>
    </a>
  );
};
