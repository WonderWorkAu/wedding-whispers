import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { useNavigate } from 'react-router-dom';

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

interface NewsCardProps {
  article: Article;
}

export const NewsCard = ({ article }: NewsCardProps) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/article', { state: article });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Recent';
    
    try {
      // First try parsing as is
      let date = new Date(dateString);
      
      // Check if it's a valid date
      if (!isNaN(date.getTime())) {
        return format(date, 'MMMM d, yyyy');
      }
      
      // Try parsing "X time ago" format (e.g., "2 hours ago", "3 days ago")
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

  return (
    <div 
      className="block transition-transform duration-300 hover:-translate-y-1 cursor-pointer group"
      onClick={handleClick}
    >
      <Card className="overflow-hidden h-full">
        {article.urlToImage && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={article.urlToImage}
              alt={article.title}
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
            {formatDate(article.publishedAt)} • {article.source.name}
          </div>
          <CardTitle className="line-clamp-2 font-serif">{article.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="line-clamp-3">{article.description}</CardDescription>
        </CardContent>
      </Card>
    </div>
  );
};
