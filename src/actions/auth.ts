/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { redirect } from "next/navigation";

import { getSession } from "~/lib/session/session";
import { ForgotPasswordData, LoginFormData, RegisterFormData, ResetPasswordData } from "~/schemas";
import { AppService } from "~/services/app/app.service";
import { HttpAdapter } from "../adapters/http-adapter";
import { AuthService } from "../services/auth.service";

// Types
type ActionResult = {
  success?: boolean;
  message?: string;
  error?: string;
  redirectUrl?: string;
};

// Initialize services
const httpAdapter = new HttpAdapter();
const authService = new AuthService(httpAdapter);
const appService = new AppService(httpAdapter);

export async function loginAction(data: LoginFormData): Promise<ActionResult> {
  try {
    const user = await authService.login(data);

    if (!user) {
      return {
        error: "Invalid email or password. Please try again.",
      };
    }

    await authService.createUserSession(user);

    return {
      success: true,
      message: `Welcome back, ${user.name}!`,
      redirectUrl: `/dashboard/${user.id}/home`,
    };
  } catch (error: any) {
    return {
      error: error?.message ?? "An unexpected error occurred. Please try again.",
    };
  }
}

export async function logoutAction(): Promise<ActionResult> {
  try {
    await authService.logout();
    return {
      success: true,
      message: "You’ve been logged out successfully.",
    };
  } catch (error: any) {
    return {
      error: error?.message ?? "Failed to logout. Please try again.",
    };
  }
}

export async function registerAction(data: RegisterFormData) {
  try {
    const success = await authService.register(data);
    if (success) {
      return {
        success: true,
        message: "Account created successfully. Please log in.",
        redirectUrl: "/auth/login",
      };
    }

    return {
      error: "Email already exists. Please use a different email.",
    };
  } catch (error: any) {
    return {
      error: error?.message ?? "An unexpected error occurred during registration.",
    };
  }
}

export async function googleSignInAction() {
  const redirectUrl = await authService.googleSignIn();
  if (redirectUrl) {
    redirect(redirectUrl);
  }
}

export async function handleGoogleCallbackAction(credentials: { code: string; provider: string }) {
  const user = await authService.handleGoogleCallback(credentials);
  if (!user) {
    throw new Error("Invalid email or password");
  }
  await authService.createUserSession(user);
  return user;
}

export async function forgotPasswordAction(data: ForgotPasswordData): Promise<ActionResult> {
  try {
    const response = await authService.forgotPassword(data);
    return {
      success: true,
      message: response?.message ?? "Password reset email sent successfully.",
    };
  } catch (error: any) {
    return {
      error: error?.message ?? "Failed to send password reset email. Please try again.",
    };
  }
}

export async function resetPasswordAction(data: ResetPasswordData): Promise<ActionResult> {
  try {
    const response = await authService.resetPassword(data);

    if (response) {
      return {
        success: true,
        message: "Your password has been reset successfully. Please log in.",
        redirectUrl: "/auth/login",
      };
    }

    return {
      error: "Password reset failed. Please try again.",
    };
  } catch (error: any) {
    return {
      error: error?.message ?? "Failed to reset password. Please try again.",
    };
  }
}

export async function getUser(): Promise<IUser | null> {
  try {
    const session = await getSession();
    if (!session) return null;
    const user = await appService.getUser();
    if (!user) {
      redirect("/auth/login");
      return null;
    }
    return user;
  } catch {
    redirect("/auth/login");
    return null;
  }
}
