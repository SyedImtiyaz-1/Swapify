export const verifyToken = async (token: string) => {
    if (!token) return { isLoggedIn: false, user: null };
    
    try {
        const response = await fetch(`${process.env.BACKEND}/verify-token`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            return { isLoggedIn: false, user: null };
        }

        const data = await response.json();
        return {
            isLoggedIn: Boolean(data.isLoggedIn),
            user: data.user || null
        };
    } catch (error) {
        console.error('Token verification failed:', error);
        return {
            isLoggedIn: false,
            user: null
        };
    }
}
