import { z } from 'zod';
import { CreateUserDto, UpdateUserDto, UserRole, UserStatus } from './types';

export const userFormSchema = z
  .object({
    firstName: z.string().min(1, 'Vui lòng nhập tên'),
    lastName: z.string().min(1, 'Vui lòng nhập họ'),
    email: z.string().email('Email không hợp lệ'),
    role: z.string().min(1, 'Vui lòng chọn vai trò'),
    group: z.string().min(1, 'Vui lòng chọn nhóm'),
    username: z.string().min(1, 'Vui lòng nhập username'),

    password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),

    confirmPassword: z.string().min(6, 'Xác nhận mật khẩu không đúng'),
    // optional fields
    phone: z.string().optional(),
    //unit still testing
    unit: z.array(z.string()).min(1, 'Vui lòng chọn ít nhất 1 đơn vị'),
    //
    department: z.string().optional(),
    address: z.string().optional(),
    note: z.string().optional()
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword;
    },
    {
      message: 'Mật khẩu không khớp',
      path: ['confirmPassword']
    }
  );

export const changenewpassFormSchema = z
  .object({
    oldpassword: z.string().trim().min(6, 'validation.password_min'),
    newpassword: z.string().trim().min(6, 'validation.password_min'),
    confirmPassword: z.string().trim().min(6, 'validation.password_min')
  })
  .refine((data) => data.newpassword === data.confirmPassword, {
    message: 'validation.password_not_match',
    path: ['confirmPassword']
  });

export const changepassFormSchema = z
  .object({
    newpassword: z.string().min(6, 'validation.password_min'),
    confirmPassword: z.string().min(6, 'validation.password_min')
  })
  .refine((data) => data.newpassword === data.confirmPassword, {
    message: 'validation.password_not_match',
    path: ['confirmPassword']
  });

export const updateUserSchema = z.object({
  id: z.string().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional(),
  role: z.string().min(1),
  group: z.string().optional(),
  username: z.string().optional(),
  phone: z.string().optional(),
  //unit still testing
  unit: z.array(z.string()).min(1, 'Vui lòng chọn ít nhất 1 đơn vị'),
  //
  department: z.string().optional(),
  address: z.string().optional(),
  note: z.string().optional()
});

export type CreateUserFormValues = z.infer<typeof userFormSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;

export type UserFormValues = CreateUserFormValues | UpdateUserFormValues;

export function convertUserFormToApiPayload(
  formValues: UserFormValues,
  isEdit: boolean
): CreateUserDto | UpdateUserDto {
  const basePayload = {
    first_name: formValues.firstName,
    last_name: formValues.lastName,
    tags: formValues.unit,
    metadata: {
      address: formValues.address,
      phone: formValues.phone,
      // unit: formValues.unit,
      department: formValues.department,
      roleId: formValues.role
    }
  };

  if (!isEdit) {
    const update = formValues as CreateUserFormValues;
    return {
      ...basePayload,
      status: UserStatus.ENABLED,
      email: update.email,
      credentials: {
        username: update.username,
        secret: update.password
      }
    } satisfies CreateUserDto;
  }

  return basePayload;
}
