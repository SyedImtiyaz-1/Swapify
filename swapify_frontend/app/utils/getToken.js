export const getToken = () => {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
  
  if (!tokenCookie) return null;
  
  return tokenCookie.split('=')[1];
}; 