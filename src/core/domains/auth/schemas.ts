import { z } from 'zod';

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'auth.validation.username_required')
    .min(3, 'auth.validation.username_min'),
  password: z
    .string()
    .min(1, 'auth.validation.password_required')
    .min(6, 'auth.validation.password_min'),
  rememberMe: z.boolean().optional()
});

export const signupSchema = z
  .object({
    username: z
      .string()
      .min(1, 'auth.validation.username_required')
      .min(3, 'auth.validation.username_min'),
    password: z
      .string()
      .min(6, 'auth.validation.password_min')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'auth.validation.password_regex'
      ),
    confirmPassword: z
      .string()
      .min(1, 'auth.validation.confirm_password_required'),
    agreeToTerms: z
      .boolean()
      .refine((val) => val === true, 'auth.validation.terms_required')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'auth.validation.passwords_mismatch',
    path: ['confirmPassword']
  });

export const profileUpdateSchema = z.object({
  name: z
    .string()
    .min(1, 'auth.validation.name_required')
    .min(2, 'auth.validation.name_min'),
  email: z
    .string()
    .min(1, 'auth.validation.email_required')
    .email('auth.validation.email_invalid')
});

const metadataSchema = z.object({
  about: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  unit: z.string().optional(),
  department: z.string().optional(),
  roleId: z.string()
});

export const updateProfileSchema = z.object({
  first_name: z.string().min(1, 'validation.firstname_required'),
  last_name: z.string().min(1, 'validation.lastname_required'),
  metadata: metadataSchema.optional()
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
