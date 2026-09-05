import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AppContext";
import HeroSection from "../components/home/HeroSection";
import FeaturesSection from "../components/home/FeaturesSection";
import CTASection from "../components/home/CTASection";
import Footer from "../components/home/Footer";

const Home = () => {
  const { user } = useAuth();

  if (user?.role("user")) {
    return <Navigate to="/dashboard" replace />;
  }

  if (user?.role("admin")) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </>
  );
};

export default Home;
