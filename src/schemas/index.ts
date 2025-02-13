import * as z from "zod";

export const registerSchema = z
  .object({
    full_name: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  // .min(8, "Password must be at least 8 characters"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters"),
  password_confirmation: z.string().min(1, "Confirm password is required"),
});

// Base schema for common fields
const BaseSchema = z.object({
  product_type: z.enum(["digital_product", "skill_selling"]),
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  price: z.number().min(1, "Price must be a positive number"),
  discount_price: z.number().min(0, "Discount must be a positive number"),
  description: z.string().min(1, "Description is required"),
  cover_photos: z.array(z.any()).min(1, "Cover photo is required"),
  thumbnail: z.any().refine((file) => file !== null, "Thumbnail is required"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  highlights: z.array(z.string()).min(1, "At least one highlight is required"),
});

// Digital product schema
const DigitalProductSchema = BaseSchema.extend({
  product_type: z.literal("digital_product"),
  assets: z.array(z.any()).min(1, "Product files are required").max(4, "You can upload up to 4 files"),
});

// Skill selling schema
const SkillSellingSchema = BaseSchema.extend({
  product_type: z.literal("skill_selling"),
  resource_link: z.array(z.string()).min(1, "At least one resource link is required"),
  portfolio_link: z.string().min(1, "Portfolio link is required"),
});

// Combined schema using Zod's union
export const ProductFormSchema = z.discriminatedUnion("product_type", [DigitalProductSchema, SkillSellingSchema]);

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
// export type ProductFormData = z.infer<typeof ProductFormSchema>;
