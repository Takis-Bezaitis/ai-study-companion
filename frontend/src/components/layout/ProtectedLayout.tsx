import { Outlet, Navigate } from "react-router";
import { useAuthStore } from "../../store/authStore";
import LoadingScreen from "../common/LoadingScreen";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

const ProtectedLayout = () => {
  const { user, loading } = useAuthStore();

  if (loading) return <LoadingScreen />;

  if (!user) {
    return <Navigate to='/auth/login' replace/>
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
};

export default ProtectedLayout;