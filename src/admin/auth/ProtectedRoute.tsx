import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/admin/auth/AuthProvider";
import { hasRequiredRole, type AdminRole } from "@/admin/auth/permissions";

interface ProtectedRouteProps {
  allowedRoles?: AdminRole[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, roles, isAdmin, loading, rolesLoading } = useAuth();
  const location = useLocation();

  if (loading || (user && rolesLoading)) {
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

  if (allowedRoles && !hasRequiredRole(roles, allowedRoles)) {
    return (
      <div className="min-h-screen grid place-items-center bg-background p-6 text-center">
        <div className="max-w-sm space-y-2">
          <h1 className="font-display text-2xl font-bold">Permission required</h1>
          <p className="text-sm text-muted-foreground">
            Your account is signed in, but it doesn&apos;t have permission to view this admin page.
          </p>
        </div>
      </div>
    );
  }

  return <Outlet />;
};
