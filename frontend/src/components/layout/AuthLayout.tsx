import { Outlet, Navigate } from "react-router";
import { useAuthStore } from "../../store/authStore";
import LoadingScreen from "../common/LoadingScreen";

const AuthLayout = () => {
  const { user, loading } = useAuthStore();

  if (loading) {
    return <LoadingScreen />;
  }

  if (user) {
    // If already logged in, don't allow access to /auth/*
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex items-center justify-center min-h-dvh bg-gray-50">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
