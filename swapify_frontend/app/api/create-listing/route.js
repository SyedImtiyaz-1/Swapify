export async function POST(req) {
  const tokenCookie = req.cookies.get('token');
  console.log(tokenCookie);
    
    const token = tokenCookie ? tokenCookie.value : null;
    const body = await req.json();
    
  
    if (!token) {
      return Response.json({ error: 'No authentication token found' }, { status: 401 });
    }
  
    try {
      // Validate location data
      if (!body.location?.lat || !body.location?.lon) {
        return Response.json({ 
          error: 'Location coordinates are required' 
        }, { status: 400 });
      }

      const transformedBody = {
        ...body,
        phoneNumber: body.phoneNumber,
        coverImageName: body.coverImageName,
        additionalImageNames: body.additionalImageNames,
        location: {
          lat: parseFloat(body.location.lat),
          lon: parseFloat(body.location.lon),
          display_name: body.location.display_name
        }
      };

      const response = await fetch(`${process.env.BACKEND}/create-listing`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(transformedBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create listing');
      }

      const data = await response.json();
      
  
      return Response.json(data);
    } catch (error) {
      console.error('Error creating listing:', error);
      return Response.json({ 
        error: error.message || 'Failed to create listing' 
      }, { status: 500 });
    }
  }