import { Navigate } from "react-router";
import { useAuthStore } from "../store/authStore.js";
import LoadingScreen from "../components/common/LoadingScreen";

const IndexRedirect = () => {
  const { user, loading } = useAuthStore();

  if (loading) {
    return <LoadingScreen />;
  }

  return user
    ? <Navigate to="/dashboard" replace />
    : <Navigate to="/auth/login" replace />;
};

export default IndexRedirect;