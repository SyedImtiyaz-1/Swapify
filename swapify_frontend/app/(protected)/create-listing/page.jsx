import CreateListingForm from './CreateListingForm';
import Header from '@/app/components/header/Header';
import MobileNavigation from '@/app/components/MobileNavigation';

const CreateListingPage = () => {
  return (
    <>
      <Header />
      
      <section className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen pb-20 md:pb-4">
        <div className="max-w-7xl mx-auto">
          <div className="px-4 py-4">
            <h2 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 text-center mb-2">
              Create New Listing
            </h2>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 text-center mb-6">
              Fill in the details below to create your listing
            </p>
          </div>
          <CreateListingForm />
        </div>
      </section>
      
      <MobileNavigation />
    </>
  );
};

export default CreateListingPage;