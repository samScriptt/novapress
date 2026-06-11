import { esClient, POSTS_INDEX } from './client';

interface SearchPostsResult {
  ids: number[];
  total: number;
}

export async function searchPosts(query: string, from: number, size: number): Promise<SearchPostsResult> {
  const result = await esClient.search({
    index: POSTS_INDEX,
    from,
    size,
    query: {
      multi_match: {
        query,
        fields: ['title^3', 'summary', 'tags'],
        fuzziness: 'AUTO',
        prefix_length: 1,
      },
    },
  });

  const total =
    typeof result.hits.total === 'number'
      ? result.hits.total
      : result.hits.total?.value || 0;

  const ids = result.hits.hits.map((hit) => (hit._source as { id: number }).id);

  return { ids, total };
}
