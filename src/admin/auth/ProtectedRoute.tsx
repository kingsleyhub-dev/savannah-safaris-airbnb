import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { Loader2 } from "lucide-react";

export const ProtectedRoute = () => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin" replace state={{ from: location.pathname }} />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center bg-background p-6 text-center">
        <div className="max-w-sm space-y-2">
          <h1 className="font-display text-2xl font-bold">Access denied</h1>
          <p className="text-sm text-muted-foreground">
            Your account is signed in but does not have admin privileges. Ask a super admin to grant you access.
          </p>
        </div>
      </div>
    );
  }

  return <Outlet />;
};
