export async function GET() {
  try {
    const data = await fetch(`${process.env.BACKEND}/listings`);

    if (!data.ok) {
      throw new Error('Failed to fetch listings');
    }

    const posts = await data.json();
 
    return Response.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return Response.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

