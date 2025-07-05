import Header from "@/app/components/header/Header";
import MobileNavigation from "@/app/components/MobileNavigation";
import MyListingsClient from "./MyListingsClient";

const MyListings = () => {
  return (
    <>
      <Header />
      <MobileNavigation />
      <MyListingsClient />
    </>
  );
};

export default MyListings;