import express from 'express';
import cors from 'cors';
import { fetchArticleContent } from './articleFetcher';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/article', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    const article = await fetchArticleContent(url);
    res.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Failed to fetch article content' });
  }
});

app.listen(port, () => {
  console.log(`Article server running at http://localhost:${port}`);
});
