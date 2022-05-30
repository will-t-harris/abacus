import { Navigate, Outlet } from "react-router-dom";
import { User } from "../shared/types";

export function ProtectedRoute({
  user,
  redirectPath = "/login",
}: {
  user?: User;
  redirectPath?: string;
}) {
  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}
