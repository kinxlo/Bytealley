/* eslint-disable @typescript-eslint/no-explicit-any */
import { ToastProps } from "../components/ui/toast";

declare global {
  type UserRole = "admin" | "user" | "guest";
  type AuthStatus = "authenticated" | "unauthenticated" | "loading";
  type Theme = "light" | "dark";

  type ExtendedToastProps = ToastProps & {
    description: string;
  };

  type LogoProperties = {
    logo: string;
  };

  type RootState = ReturnType<typeof import("@/store").store.getState>;
  type AppDispatch = typeof import("@/store").store.dispatch;

  type DependencyInjector = (Component: React.ElementType, dependencies: { [key: string]: symbol }) => any;

  type ResolveDependencies = {
    [key: string]: object;
  };

  // Define strict types for table data and actions
  type DataItem = Record<string, any>;
}

// This export is needed to make the file a module
export {};
