import { z } from 'zod';

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'Tên đăng nhập là bắt buộc')
    .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
  password: z
    .string()
    .min(1, 'Mật khẩu là bắt buộc')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  rememberMe: z.boolean().optional()
});

export const signupSchema = z
  .object({
    username: z
      .string()
      .min(1, 'Tên đăng nhập là bắt buộc')
      .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
    password: z
      .string()
      .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường và một số'
      ),
    confirmPassword: z.string().min(1, 'Xác nhận mật khẩu là bắt buộc'),
    agreeToTerms: z
      .boolean()
      .refine((val) => val === true, 'Bạn phải đồng ý với điều khoản sử dụng')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword']
  });

export const profileUpdateSchema = z.object({
  name: z
    .string()
    .min(1, 'Họ và tên là bắt buộc')
    .min(2, 'Họ và tên phải có ít nhất 2 ký tự'),
  email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ')
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
