import Header from '@/app/components/header/Header';
import MobileNavigation from '@/app/components/MobileNavigation';
import EditListingForm from './EditListingForm';

// Mark as async server component
export default async function EditListingPage({ params }) {
  const { id } = params;

  if (!id) {
    return (
      <>
        <Header />
        <MobileNavigation />
        <section className="bg-white dark:bg-gray-900 pb-20 md:pb-4">
          <div className="max-w-3xl px-4 py-4 mx-auto">
            <div className="text-center text-red-600 dark:text-red-400">
              Listing ID not found
            </div>
          </div>
        </section>
      </>
    );
  }
  
  return (
    <>
      <Header />
      <section className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen pb-20 md:pb-4">
        <div className="max-w-7xl mx-auto">
          <div className="px-4 py-4">
            <h2 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 text-center mb-2">
              Edit Listing
            </h2>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 text-center mb-6">
              Update your listing details below
            </p>
          </div>
          <EditListingForm listingId={id} />
        </div>
      </section>
      <MobileNavigation />
    </>
  );
}

// Generate metadata for the page
export async function generateMetadata({ params }) {
  const { id } = params;
  
  if (!id) {
    return {
      title: 'Edit Listing - Swapify',
      description: 'Edit your listing on Swapify'
    };
  }

  try {
    const response = await fetch(`${process.env.BACKEND}/listings/${id}`);
    const listing = await response.json();

    return {
      title: `Edit: ${listing.title} - Swapify`,
      description: `Edit your listing: ${listing.title}`
    };
  } catch (error) {
    return {
      title: 'Edit Listing - Swapify',
      description: 'Edit your listing on Swapify'
    };
  }
}