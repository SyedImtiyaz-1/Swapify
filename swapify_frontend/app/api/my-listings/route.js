
 
export async function GET( req) {
    const tokenCookie = req.cookies.get('token');
    const token = tokenCookie ? tokenCookie.value : null;
  
    if (!token) {
      return Response.json({ error: 'No authentication token found' }, { status: 401 });
    }
  
    try {
      const data = await fetch(`${process.env.BACKEND}/my-listings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!data.ok) {
        throw new Error('Failed to fetch listings');
      }
  
      const listings = await data.json();
   
      return Response.json(listings);
    } catch (error) {
      console.error('Error fetching listings:', error);
      return Response.json({ error: 'Failed to fetch listings' }, { status: 500 });
    }
  }
  
  