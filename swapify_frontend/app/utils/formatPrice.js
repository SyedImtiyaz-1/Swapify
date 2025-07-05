export const formatPrice = (price) => {
    // Convert to number and handle invalid inputs
    const numPrice = Number(price);
    if (isNaN(numPrice)) return '0';
    
    // Format with Indian numbering system (e.g., 1,00,000)
    return numPrice.toLocaleString('en-IN');
}; 