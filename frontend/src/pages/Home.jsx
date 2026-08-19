import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AppContext";

const Home = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div></div>;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the home page.</p>
    </div>
  );
};

export default Home;
