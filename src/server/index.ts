
import express, { Request, Response } from 'express';
import cors from 'cors';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import axios from 'axios';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

interface ArticleQueryParams {
  url?: string;
}

async function fetchArticleContent(url: string) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const dom = new JSDOM(response.data, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article) {
      throw new Error('Could not parse article content');
    }

    return {
      title: article.title,
      content: article.content,
      textContent: article.textContent,
      excerpt: article.excerpt,
      byline: article.byline,
      dir: article.dir,
      siteName: article.siteName,
      lang: article.lang
    };
  } catch (error) {
    console.error('Error fetching article:', error);
    throw error;
  }
}

app.get('/api/article', async (req: Request<{}, any, any, ArticleQueryParams>, res: Response) => {
  try {
    const { url } = req.query;
    
    if (!url || typeof url !== 'string') {
      res.status(400).json({ error: 'URL parameter is required' });
      return;
    }

    const article = await fetchArticleContent(url);
    res.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Failed to fetch article content' });
  }
});

export default app;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Article server running at http://localhost:${port}`);
  });
}
