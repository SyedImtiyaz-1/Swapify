export async function DELETE(req, { params }) {
    const { id } = params;
    const tokenCookie = req.cookies.get('token');
    const token = tokenCookie ? tokenCookie.value : null;
    
    if (!token) {
        return Response.json({ error: 'No authentication token found' }, { status: 401 });
    }

    try {
        const response = await fetch(`${process.env.BACKEND}/listings/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to delete listing');
        }

        return Response.json(data);
    } catch (error) {
        console.error('Error deleting listing:', error);
        return Response.json(
            { error: error.message || 'Failed to delete listing' }, 
            { status: 500 }
        );
    }
} 