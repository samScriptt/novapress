import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { esClient, POSTS_INDEX, ensurePostsIndex } from '@/utils/elasticsearch/client';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 1000;

export async function GET() {
  try {
    await ensurePostsIndex();

    let totalIndexed = 0;
    const erroredDocuments: any[] = [];

    for (let from = 0; ; from += PAGE_SIZE) {
      const { data: posts, error } = await supabase
        .from('posts')
        .select('id, title, summary, category, tags, image_url, created_at')
        .range(from, from + PAGE_SIZE - 1);

      if (error) throw error;
      if (!posts || posts.length === 0) break;

      const operations = posts.flatMap((post) => [
        { index: { _index: POSTS_INDEX, _id: post.id.toString() } },
        post,
      ]);

      const bulkResponse = await esClient.bulk({ refresh: true, operations });

      if (bulkResponse.errors) {
        bulkResponse.items.forEach((action, i) => {
          const op = action.index;
          if (op?.error) {
            erroredDocuments.push({ status: op.status, error: op.error, document: posts[i] });
          }
        });
      }

      totalIndexed += posts.length;

      if (posts.length < PAGE_SIZE) break;
    }

    if (totalIndexed === 0) {
      return NextResponse.json({ message: 'No posts to index.' });
    }

    if (erroredDocuments.length > 0) {
      return NextResponse.json({ success: false, indexed: totalIndexed, errors: erroredDocuments }, { status: 500 });
    }

    return NextResponse.json({ success: true, indexed: totalIndexed });
  } catch (error: any) {
    console.error('Reindex error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
