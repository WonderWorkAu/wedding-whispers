
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface NewsCardProps {
  title: string;
  description: string;
  publishedAt: string;
  urlToImage: string | null;
  source: string;
  url: string;
}

export const NewsCard = ({ title, description, publishedAt, urlToImage, source, url }: NewsCardProps) => {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block transition-transform duration-300 hover:-translate-y-1">
      <Card className="overflow-hidden h-full">
        {urlToImage && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={urlToImage}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
              }}
            />
          </div>
        )}
        <CardHeader className="space-y-2">
          <div className="text-sm text-muted-foreground">
            {format(new Date(publishedAt), "MMM dd, yyyy")} • {source}
          </div>
          <CardTitle className="line-clamp-2 font-serif">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="line-clamp-3">{description}</CardDescription>
        </CardContent>
      </Card>
    </a>
  );
};
