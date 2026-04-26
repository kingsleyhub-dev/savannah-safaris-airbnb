export type AdminRole = "super_admin" | "admin" | "editor";

export const ADMIN_PORTAL_ROLES: AdminRole[] = ["super_admin", "admin", "editor"];

export const CONTENT_MANAGER_ROLES: AdminRole[] = ["super_admin", "admin", "editor"];

export const MEDIA_MANAGER_ROLES: AdminRole[] = ["super_admin", "admin"];

export const SETTINGS_MANAGER_ROLES: AdminRole[] = ["super_admin", "admin"];

export const hasRequiredRole = (roles: AdminRole[], allowedRoles: AdminRole[]) =>
  roles.some((role) => allowedRoles.includes(role));