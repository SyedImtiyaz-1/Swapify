import Header from '@/app/components/header/Header';
import ListingContent from './components/ListingContent';

// Fetch function for server-side data fetching
async function getListing(id) {
  try {
    const response = await fetch(`${process.env.BACKEND}/listings/${id}`, {
      cache: 'no-store' // Disable caching for real-time data
    });
    
    
    if (!response.ok) {
      throw new Error(`Failed to fetch listing: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching listing:', error);
    throw error;
  }
}

async function getRelatedListings(currentListingId) {
  try {
    const response = await fetch(
      `${process.env.BACKEND}/listings?limit=5`,
      { cache: 'no-store' }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch related listings: ${response.statusText}`);
    }
    
    const data = await response.json();
    // Filter out the current listing and limit to 4 items
    return data
      .filter(listing => listing._id !== currentListingId)
      .slice(0, 4);
  } catch (error) {
    console.error('Error fetching related listings:', error);
    return []; // Return empty array on error
  }
}

// Metadata generation for the listing page
export async function generateMetadata({ params }) {
  try {
    const listing = await getListing(params.id);
    
    return {
      title: `${listing.title} - Available for Swap`,
      description: `${listing.description.substring(0, 155)}...`,
      openGraph: {
        title: `${listing.title} - Available for Swap on Swapify`,
        description: listing.description.substring(0, 155),
        images: listing.images.map(image => ({
          url: image,
          width: 800,
          height: 600,
          alt: listing.title
        }))
      },
      twitter: {
        card: 'summary_large_image',
        title: `${listing.title} - Available for Swap`,
        description: listing.description.substring(0, 155),
        images: listing.images[0]
      }
    };
  } catch (error) {
    return {
      title: 'Listing - Swapify',
      description: 'View this item available for swap on Swapify'
    };
  }
}

export default async function ListingPage({ params }) {
  const { id } = await params;
  try {
    // Fetch listing data
    const listing = await getListing(id);
    
    // Only fetch related listings if we have a listing and category
    const relatedListings = listing?.category 
      ? await getRelatedListings(listing.category, id)
      : [];

    if (!listing) {
      return (
        <>
          <Header />
          <div className="container mx-auto px-4 py-8">
            <div className="text-center text-gray-600 dark:text-gray-400">
              No listing found
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        <Header />
        <ListingContent 
          listing={listing} 
          relatedListings={relatedListings}
        />
      </>
    );
  } catch (error) {
    console.error('Error in ListingPage:', error);
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-600 dark:text-red-400">
            Error loading listing. Please try again later.
          </div>
        </div>
      </>
    );
  }
}


