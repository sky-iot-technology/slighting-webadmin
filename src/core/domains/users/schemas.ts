import { z } from 'zod';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

export const userFormSchema = z
  .object({
    firstName: z.string().min(1, 'Vui lòng nhập tên'),
    lastName: z.string().min(1, 'Vui lòng nhập họ'),
    email: z.string().email('Email không hợp lệ'),
    role: z.string().min(1, 'Vui lòng chọn vai trò'),
    group: z.string().min(1, 'Vui lòng chọn nhóm'),
    status: z.enum(['enabled', 'disabled']),
    username: z.string().min(1, 'Vui lòng nhập username'),
    password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
    confirmPassword: z.string().min(6, 'Xác nhận mật khẩu không đúng'),

    // optional fields
    phone: z.string().optional(),
    unit: z.string().optional(),
    department: z.string().optional(),
    address: z.string().optional(),
    note: z.string().optional(),

    profile_picture: z
      .any()
      .refine(
        (files) => !files || files?.length === 0 || files?.length === 1,
        'Image is optional.'
      )
      .refine(
        (files) =>
          !files || files?.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE,
        `Max file size is 5MB.`
      )
      .refine(
        (files) =>
          !files ||
          files?.length === 0 ||
          ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
        '.jpg, .jpeg, .png and .webp files are accepted.'
      )
      .optional()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword']
  });

export const changepassFormSchema = z
  .object({
    newpassword: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
    confirmPassword: z.string().min(6, 'Xác nhận mật khẩu không đúng')
  })
  .refine((data) => data.newpassword === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword']
  });

export type UserFormValues = z.infer<typeof userFormSchema>;

export function convertUserFormToApiPayload(
  formValues: UserFormValues
): Record<string, any> {
  return {
    // first_name: formValues.firstName,
    // last_name: formValues.lastName,
    // status: formValues.status,
    // role: 'admin',
    // credentials: {username: formValues.username},
    // email: formValues.email,
    // metadata: {
    //     address: formValues.address,
    //     e
    // }
  };
}
