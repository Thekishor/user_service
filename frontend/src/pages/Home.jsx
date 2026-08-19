import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AppContext";
import HeroSection from "../components/home/HeroSection";
import FeaturesSection from "../components/home/FeaturesSection";

const Home = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="ml-2">Loading...</div>;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <HeroSection />
      <FeaturesSection />
    </>
  );
};

export default Home;
