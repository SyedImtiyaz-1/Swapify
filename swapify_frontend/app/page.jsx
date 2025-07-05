import Header from "./components/header/Header";
import MobileNavigation from "./components/MobileNavigation";
import Listings from "./components/Listings";

export const metadata = {
  title: "Swapify - Buy and Sell Used Products Near You!",
  description: "Join Swapify to discover amazing items to swap in your local area. Sell and buy used goods, find great deals, and connect with nearby swappers.",
  openGraph: {
    title: "Swapify - Buy and Sell Used Products Near You!",
    description: "Join Swapify to discover amazing items to swap in your local area. Sell and buy used goods, find great deals, and connect with nearby swappers.",
  }
};



const Home = () => {
    return (
        <>
            <Header />
            <MobileNavigation />
            <main className="min-h-screen">
                <h1 className="sr-only">Swapify - Local Marketplace</h1>
                <Listings />
            </main>
        </>
    );
};

export default Home;