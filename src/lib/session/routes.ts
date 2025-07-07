export const publicRoutes: string[] = [
  "/",
  "/seller",
  "/features",
  "/explore/*",
  "/pricing",
  "/terms-and-conditions",
  "/privacy-policy",
  "/about",
  "/contact",
  "/guides",
];

export const authRoutes: string[] = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/fetching-data/*",
];

export const userRoutes: string[] = [
  "/dashboard/:userID/home",
  "/dashboard/:userID/profile",
  "/dashboard/:userID/settings",
  "/dashboard/:userID/downloads",
];

export const adminRoutes: string[] = ["/admin/home", "/admin/users", "/admin/settings", "/admin/reports"];

export const superAdminRoutes: string[] = [
  ...adminRoutes, // Has access to all admin routes
  "/super-admin/dashboard",
  "/super-admin/admin-management", // Can manage other admins
  "/super-admin/system-settings", // Global system settings
  "/super-admin/audit-logs", // View all system logs
];

export const isUserSpecificRoute = (userID: string, route: string): boolean => {
  return route.includes(`:userID`);
};
