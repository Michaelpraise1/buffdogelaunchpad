import HeroSection from "../components/home/HeroSection";
import { Header } from "../components/navigation/Header";
import Activities from "../components/tokens/Activities";
import TokensPage from "./TokensPage";

const Home = () => {
  return (
    <div className="home-bg w-full min-h-screen relative">
      <Header />
      <HeroSection />
      <Activities />
      <TokensPage />
    </div>
  );
};
export default Home;
