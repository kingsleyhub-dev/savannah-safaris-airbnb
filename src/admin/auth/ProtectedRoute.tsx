import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { Loader2 } from "lucide-react";

export const ProtectedRoute = () => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/admin" replace state={{ from: location }} />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center p-6 text-center">
        <div className="space-y-3 max-w-md">
          <h1 className="font-display text-2xl font-bold">Access denied</h1>
          <p className="text-muted-foreground">
            You're signed in but don't have admin permissions. Contact the site owner to request access.
          </p>
        </div>
      </div>
    );
  }
  return <Outlet />;
};
