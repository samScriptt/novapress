import { Client } from '@elastic/elasticsearch';

export const esClient = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
});

export const POSTS_INDEX = 'posts';

export async function ensurePostsIndex() {
  const exists = await esClient.indices.exists({ index: POSTS_INDEX });

  if (!exists) {
    await esClient.indices.create({
      index: POSTS_INDEX,
      mappings: {
        properties: {
          id: { type: 'integer' },
          title: { type: 'text', analyzer: 'standard' },
          summary: { type: 'text', analyzer: 'standard' },
          category: { type: 'keyword' },
          tags: { type: 'keyword' },
          image_url: { type: 'keyword', index: false },
          created_at: { type: 'date' },
        },
      },
    });
  }
}
