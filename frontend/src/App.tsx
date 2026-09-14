import { useEffect, Suspense } from "react";
import { RouterProvider } from "react-router";
import { Toaster } from "react-hot-toast";

import LoadingScreen from "./components/common/LoadingScreen";
import { useAuthStore } from "./store/authStore";
import { routes } from "./routes/routes";

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Toaster 
        position="top-right" 
        reverseOrder={false} 
        toastOptions={{
          duration: 2000,
        }}
      />
      <RouterProvider router={routes} />
    </Suspense>
  )
}

export default App
