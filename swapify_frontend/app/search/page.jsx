import Header from "../components/header/Header";
import MobileNavigation from "../components/MobileNavigation";
import SearchListingContainer from "../components/search/SearchListingContainer";

export default async function SearchPage({ searchParams }) {
  // Get the search query from URL params
  const query = searchParams?.q || '';
  
  return (
    <>
      <Header />
      <MobileNavigation />
      <SearchListingContainer initialQuery={query} />
    </>
  );
}
