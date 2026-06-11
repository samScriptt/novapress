import { NextRequest, NextResponse } from 'next/server';
import { searchPosts } from '@/utils/elasticsearch/search';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q');

  if (!q || !q.trim()) {
    return NextResponse.json({ results: [], total: 0 });
  }

  try {
    const { ids, total } = await searchPosts(q, 0, 20);
    return NextResponse.json({ results: ids, total });
  } catch (error: any) {
    console.error('Search error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
