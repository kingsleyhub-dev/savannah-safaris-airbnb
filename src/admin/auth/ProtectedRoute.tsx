import { Outlet } from "react-router-dom";

// ⚠️ Authentication intentionally disabled per user request.
// Anyone visiting /admin/dashboard can access the admin UI.
export const ProtectedRoute = () => {
  return <Outlet />;
};
