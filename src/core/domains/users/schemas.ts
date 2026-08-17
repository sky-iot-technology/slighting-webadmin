import { z } from 'zod';
import { CreateUserDto, UpdateUserDto, UserRole, UserStatus } from './types';

export const userFormSchema = z
  .object({
    firstName: z.string().min(1, 'user.validation.first_name_required'),
    lastName: z.string().min(1, 'user.validation.last_name_required'),
    email: z.string().email('user.validation.email_invalid'),
    role: z.string().optional(),
    group: z.string().optional(),
    username: z.string().min(1, 'user.validation.username_required'),

    password: z.string().min(6, 'user.validation.password_min'),

    confirmPassword: z
      .string()
      .min(6, 'user.validation.password_confirm_mismatch'),
    // optional fields
    phone: z.string().optional(),
    //unit still testing
    unit: z.array(z.string()).min(1, 'user.validation.unit_required'),
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
      message: 'user.validation.password_not_match',
      path: ['confirmPassword']
    }
  );

export const changenewpassFormSchema = z
  .object({
    oldpassword: z.string().trim().min(6, 'user.validation.password_min'),
    newpassword: z.string().trim().min(6, 'user.validation.password_min'),
    confirmPassword: z.string().trim().min(6, 'user.validation.password_min')
  })
  .refine((data) => data.newpassword === data.confirmPassword, {
    message: 'user.validation.password_not_match',
    path: ['confirmPassword']
  });

export const changepassFormSchema = z
  .object({
    newpassword: z.string().min(6, 'user.validation.password_min'),
    confirmPassword: z.string().min(6, 'user.validation.password_min')
  })
  .refine((data) => data.newpassword === data.confirmPassword, {
    message: 'user.validation.password_not_match',
    path: ['confirmPassword']
  });

export const updateUserSchema = z.object({
  id: z.string().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional(),
  role: z.string().optional(),
  group: z.string().optional(),
  username: z.string().optional(),
  phone: z.string().optional(),
  //unit still testing
  unit: z.array(z.string()).min(1, 'user.validation.unit_required'),
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
      department: formValues.department
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
