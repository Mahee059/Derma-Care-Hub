import { z } from "zod";
const MAX_FILE_SIZE = 5000000; 
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export type loginFormData = z.infer<typeof loginFormSchema>;
export type registerFormData = z.infer<typeof registerFormSchema>;
export type ProgressLogFormValues = z.infer<typeof progressLogSchema>;
export type RoutineFormValues = z.infer<typeof routineFormSchema>;
export type SkinAssessmentFormValues = z.infer<typeof skinAssessmentSchema>;
export type ProductFormValues = z.infer<typeof productSchema>;
export type ProfileFormValues = z.infer<typeof profileSchema>;

export const loginFormSchema = z.object({
  email: z.string().nonempty("Email is required"),
  password: z.string().nonempty("Password is required"),
});

export const registerFormSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .email("Invalid email format"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(3, "Must be 3 or more characters long")
    .max(20, "Must be less than 20 characters")
    .refine(
      (password) => /[A-Z]/.test(password),
      "Must contain one capital letter"
    )
    .refine(
      (password) => /[a-z]/.test(password),
      "Must contain one small letter"
    )
    .refine((password) => /[0-9]/.test(password), "Must contain one number")
    .refine(
      (password) => /[!@#$%^&*]/.test(password),
      "Must contain one special character"
    ),
  name: z.string().min(3, "Name is required"),
  role: z.enum(["USER", "DERMATOLOGISTS"], {
    error: "You must select a role",
  }),
  phone: z.string().min(3, "Phone Number is required."),
  dermatologistId: z.string().optional(),
});

export const progressLogSchema = z.object({
  image: z
    .any()
    .refine(
      (file) => !file || file?.size <= MAX_FILE_SIZE,
      "Max file size is 5MB"
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported"
    )
    .optional(),
  notes: z
    .string()
    .max(500, {
      message: "Notes should not exceed 500 characters",
    })
    .optional(),
  concerns: z.string().nonempty("Please select a primary concern"),
  rating: z
    .number()
    .min(1, "Please rate your skin condition")
    .max(5),
});

export const routineFormSchema = z.object({
  name: z.string().min(3, {
    message: "Routine name must be at least 3 characters",
  }),
  type: z.string().nonempty("Please select a routine type"),
});

export const skinAssessmentSchema = z.object({
  skinType: z.enum(["DRY", "OILY", "COMBINATION", "NORMAL", "SENSITIVE"], {
    error: "Please select a skin type",
  }),
  concerns: z
    .array(
      z.enum([
        "ACNE",
        "AGING",
        "PIGMENTATION",
        "SENSITIVITY",
        "DRYNESS",
        "OILINESS",
        "REDNESS",
        "UNEVEN_TEXTURE",
      ])
    )
    .min(1, {
      message: "Please select at least one skin concern",
    }),
  allergies: z.string().optional(),
  goals: z
    .string()
    .min(10, {
      message: "Please describe your skincare goals in at least 10 characters",
    })
    .max(500, {
      message: "Goals description should not exceed 500 characters",
    }),
});

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  brand: z.string().min(1, "Brand is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  ingredients: z.string().min(1, "Ingredients are required"),
  sustainabilityScore: z.number().min(1).max(5),
  allergens: z.string().optional(),
  skinTypes: z.array(z.string()).min(1, "Select at least one skin type"),
  concerns: z.array(z.string()).min(1, "Select at least one concern"),
  image: z.any().optional(),
  price: z.number().gte(5, "Amount must be atleast 5").positive(),
  externalUrl: z.string().url("Must be a valid URL").optional(),
});

export const profileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  image: z.any().optional(),
  currentPassword: z.string().optional(),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),
});
