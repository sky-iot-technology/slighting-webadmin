'use client';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/ui/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormSchemaProvider
} from '@/ui/components/ui/form';
import { Button } from '@/ui/components/ui/button';
import CustomScrollbar from '@/ui/components/custom-scrollbar';
import { Input } from '@/ui/components/ui/input';
import { useMemo, useState, useEffect } from 'react';
import {
  convertUserFormToApiPayload,
  CreateUserDto,
  updateUserSchema,
  useCreateUser,
  User,
  userFormSchema,
  UserFormValues,
  useUpdateUser
} from '@/core/domains/users';
import {
  Eye,
  EyeOff,
  User as UserPic,
  Plus,
  Trash2,
  ShieldCheck,
  Loader2,
  Info
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/ui/components/ui/select';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/ui/components/ui/hover-card';
import { Label } from '@/ui/components/ui/label';
import { TreeProvider } from '@/ui/business/tree/TreeProvider';
import { useRegionTreeStore } from '@/core/domains/tree/store';
import Image from 'next/image';

function findRegionName(nodes: any[], id: string): string | undefined {
  if (!Array.isArray(nodes) || !id) return undefined;
  for (const node of nodes) {
    if (String(node.id) === String(id)) return node.name;
    if (node.children && node.children.length > 0) {
      const found = findRegionName(node.children, id);
      if (found) return found;
    }
  }
  return undefined;
}
import ChangepassDialog from './changepass-form';
import { MultiSelect } from '@/ui/components/ui/multi-select';
import { useTranslation } from '@/core/domains/language/useTranslation';
import {
  useGetRoles,
  useGetUserRoles,
  useGetRoleById,
  useAddUserToRole,
  useRemoveUserFromRole,
  MODULE_NAMES,
  ACTION_NAMES,
  getActionBadgeClass,
  type UIRoleResponse
} from '@/core/domains/permissions';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export interface RoleBranchBlock {
  id: string;
  roleId: string;
  branchId: string; // 'all' or specific group ID
  branchName?: string;
}

export type UserRoleAssignment = {
  id?: string;
  role_id?: string;
  scope_entity_type?: string;
  scope_entity_id?: string;
  scope_entity_name?: string;
  name?: string;
};

type RoleFormProps = {
  pageTitle: string;
  onClose?: () => void;
  initialData?: User | null;
  initialRoles?: UserRoleAssignment[];
  isView?: boolean;
};

function RolePermissionsPopover({
  roleId,
  roles
}: {
  roleId: string;
  roles?: UIRoleResponse[];
}) {
  const { data: roleDetail, isLoading } = useGetRoleById(roleId, {
    enabled: !!roleId
  });

  const listRole = roles?.find((r) => String(r.id) === roleId);
  const selectedRole = roleDetail || listRole;

  if (!selectedRole) {
    return null;
  }

  const permissions = selectedRole.permission?.ui || [];

  return (
    <HoverCard openDelay={100} closeDelay={150}>
      <HoverCardTrigger asChild>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          className='text-primary bg-primary/10 hover:bg-primary/20 border-primary/20 h-5 cursor-pointer gap-1 rounded-full border px-2 text-[11px] font-semibold transition-all'
          title='Rà chuột để xem chi tiết quyền hạn'
        >
          <Info className='h-3 w-3' />
          <span>Xem quyền</span>
        </Button>
      </HoverCardTrigger>

      <HoverCardContent
        align='start'
        className='bg-card/95 z-50 w-88 space-y-2.5 rounded-xl border p-3.5 text-xs shadow-xl backdrop-blur-md'
      >
        <div className='flex items-center justify-between border-b pb-2 text-xs'>
          <div className='text-primary flex items-center gap-2 font-bold'>
            <ShieldCheck className='h-4 w-4' />
            <span className='text-sm'>{selectedRole.name}</span>
          </div>
          {permissions.length > 0 && (
            <span className='bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[10px] font-semibold'>
              {permissions.length} danh mục
            </span>
          )}
        </div>

        {isLoading ? (
          <div className='text-muted-foreground flex items-center justify-center gap-2 py-4 text-xs'>
            <Loader2 className='text-primary h-4 w-4 animate-spin' />
            <span>Đang tải thông tin quyền...</span>
          </div>
        ) : permissions.length > 0 ? (
          <div className='max-h-56 space-y-2 overflow-y-auto pt-1 pr-1'>
            {permissions.map((item) => {
              const moduleLabel = MODULE_NAMES[item.id] || item.id;
              const actions = item.actions || [];
              return (
                <div
                  key={item.id}
                  className='bg-muted/30 dark:bg-muted/10 space-y-1 rounded-lg border p-2'
                >
                  <span className='text-foreground block text-xs font-semibold'>
                    {moduleLabel}
                  </span>
                  <div className='flex flex-wrap gap-1'>
                    {actions.map((act) => {
                      const translatedAction = ACTION_NAMES[act] || act;
                      return (
                        <span
                          key={act}
                          className={cn(
                            'inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium',
                            getActionBadgeClass(translatedAction)
                          )}
                        >
                          {translatedAction}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className='text-muted-foreground py-3 text-center text-xs'>
            Chưa có quyền hạn nào được thiết lập cho vai trò này.
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}

export default function UserForm({
  onClose,
  pageTitle,
  initialData,
  initialRoles,
  isView
}: RoleFormProps) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [isSubmittingRoles, setIsSubmittingRoles] = useState(false);

  // Fetch all enabled roles
  const { data: rolesData, isLoading: isLoadingRoles } = useGetRoles({
    status: 'enabled'
  });

  // Fetch current user roles when editing if not passed as prop
  const { data: fetchedUserRolesData } = useGetUserRoles(
    initialData?.id ?? '',
    {
      enabled: !!initialData && !initialRoles
    }
  );

  const effectiveUserRoles = initialRoles ?? fetchedUserRolesData?.roles;

  const roleOptions = useMemo(() => {
    if (!rolesData?.['ui-roles']) return [];
    return rolesData['ui-roles'].map((role) => ({
      value: String(role.id),
      label: role.name
    }));
  }, [rolesData]);

  // Dynamic Role-Branch Blocks
  const [blocks, setBlocks] = useState<RoleBranchBlock[]>([
    { id: '1', roleId: '', branchId: 'all' }
  ]);

  const { treeData, fetchTree } = useRegionTreeStore();

  useEffect(() => {
    if (!treeData || treeData.length === 0) {
      fetchTree();
    }
  }, [treeData, fetchTree]);

  // Populate blocks when effectiveUserRoles is available for an existing user
  useEffect(() => {
    if (initialData && effectiveUserRoles && effectiveUserRoles.length > 0) {
      const loadedBlocks: RoleBranchBlock[] = effectiveUserRoles.map(
        (r: any, idx: number) => {
          const rawScopeId =
            r.scope_entity_id ||
            r.scope_id ||
            r.entity_id ||
            r.scope_entity?.id ||
            '';
          const isSpecific =
            rawScopeId &&
            String(rawScopeId) !== 'all' &&
            String(rawScopeId) !== 'domain';
          const branchId = isSpecific ? String(rawScopeId) : 'all';
          const branchName =
            r.scope_entity_name ||
            r.scope_entity?.name ||
            r.scope_name ||
            r.branch_name ||
            (isSpecific ? findRegionName(treeData, branchId) : '') ||
            '';
          return {
            id: `${idx + 1}-${r.id || r.role_id || Math.random()}`,
            roleId: String(r.id || r.role_id),
            branchId,
            branchName
          };
        }
      );
      setBlocks(loadedBlocks);
    }
  }, [initialData, effectiveUserRoles, treeData]);

  const handleAddBlock = () => {
    setBlocks((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        roleId: '',
        branchId: 'all'
      }
    ]);
  };

  const handleRemoveBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const handleBlockChange = (
    id: string,
    field: keyof RoleBranchBlock,
    value: string
  ) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, [field]: value } : b))
    );
  };

  const form = useForm<UserFormValues>({
    resolver: zodResolver(!!initialData ? updateUserSchema : userFormSchema),
    defaultValues: {
      firstName: initialData?.first_name || '',
      lastName: initialData?.last_name || '',
      email: initialData?.email || '',
      role: '',
      group: '',

      username: initialData?.credentials?.username || '',
      password: '',
      confirmPassword: '',

      // optional
      phone: initialData?.metadata?.phone || '',
      unit: initialData?.tags || [],
      department: initialData?.metadata?.department || '',
      address: initialData?.metadata?.address || '',
      note: initialData?.metadata?.about || ''
    },
    disabled: isView
  });

  const addUserToRole = useAddUserToRole();
  const removeUserFromRole = useRemoveUserFromRole();

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const onSubmit = async (values: UserFormValues) => {
    // Check if any block is missing a selected role
    const hasEmptyRole = blocks.some((b) => !b.roleId);
    if (hasEmptyRole) {
      toast.error('Vui lòng chọn vai trò cho tất cả các mục nâng cao');
      return;
    }

    const apiPayload = convertUserFormToApiPayload(values, !!initialData);
    setIsSubmittingRoles(true);

    if (initialData) {
      updateUser.mutate(
        { id: String(initialData.id), data: apiPayload },
        {
          onSuccess: async (updatedUser) => {
            try {
              // 1. Remove previous role assignments
              if (effectiveUserRoles && effectiveUserRoles.length > 0) {
                for (const oldRole of effectiveUserRoles) {
                  await removeUserFromRole.mutateAsync({
                    roleId: String(oldRole.id || oldRole.role_id),
                    userId: String(updatedUser.id),
                    scopeEntityType: oldRole.scope_entity_type || undefined,
                    scopeEntityId: oldRole.scope_entity_id || undefined
                  });
                }
              }

              // 2. Add new role-branch blocks
              for (const block of blocks) {
                if (!block.roleId) continue;
                if (block.branchId === 'all' || !block.branchId) {
                  await addUserToRole.mutateAsync({
                    roleId: block.roleId,
                    userId: String(updatedUser.id)
                  });
                } else {
                  await addUserToRole.mutateAsync({
                    roleId: block.roleId,
                    userId: String(updatedUser.id),
                    scopeEntityType: 'group',
                    scopeEntityId: block.branchId
                  });
                }
              }
            } catch (err: any) {
              console.error('Failed to sync role blocks:', err);
              toast.error(err.message || 'Lỗi khi cập nhật vai trò người dùng');
            } finally {
              setIsSubmittingRoles(false);
              onClose?.();
            }
          },
          onError: () => {
            setIsSubmittingRoles(false);
          }
        }
      );
    } else {
      createUser.mutate(apiPayload as CreateUserDto, {
        onSuccess: async (newUser) => {
          try {
            for (const block of blocks) {
              if (!block.roleId) continue;
              if (block.branchId === 'all' || !block.branchId) {
                await addUserToRole.mutateAsync({
                  roleId: block.roleId,
                  userId: String(newUser.id)
                });
              } else {
                await addUserToRole.mutateAsync({
                  roleId: block.roleId,
                  userId: String(newUser.id),
                  scopeEntityType: 'group',
                  scopeEntityId: block.branchId
                });
              }
            }
          } catch (err: any) {
            console.error('Failed to assign role blocks for new user:', err);
            toast.error(
              err.message || 'Lỗi khi gán vai trò cho người dùng mới'
            );
          } finally {
            setIsSubmittingRoles(false);
            onClose?.();
          }
        },
        onError: () => {
          setIsSubmittingRoles(false);
        }
      });
    }
  };

  const isSubmitting =
    createUser.isPending || updateUser.isPending || isSubmittingRoles;

  return (
    <CustomScrollbar className='bg-card max-h-[660px] overflow-y-auto px-5 pt-3 pb-5'>
      <Card className='bg-card mx-auto w-full gap-1.5 border-0 py-0 shadow-none'>
        <CardHeader className='px-0'>
          <CardTitle className='text-primary-text text-left text-[20px] font-bold'>
            {pageTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className='px-0'>
          <FormSchemaProvider
            schema={!!initialData ? updateUserSchema : userFormSchema}
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className=''>
                <div className='flex gap-9'>
                  <div className='hidden flex-shrink-0 md:block'>
                    {initialData?.profile_picture ? (
                      <img
                        src={initialData.profile_picture}
                        alt='Avatar'
                        className='h-38 w-38 rounded-full border object-cover shadow-sm'
                      />
                    ) : (
                      <div className='flex h-38 w-38 items-center justify-center rounded-full border bg-gray-200 text-xs text-gray-500'>
                        <UserPic width={80} height={80} />
                      </div>
                    )}
                  </div>

                  <div className='flex-1'>
                    <h3 className='pb-2 text-[16px] font-bold'>
                      {t('user.personal_info' as any)}
                    </h3>
                    <div className='grid grid-cols-2 gap-x-3 md:grid-cols-3'>
                      <FormField
                        control={form.control}
                        name='firstName'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-xs font-bold'>
                              {t('user.first_name' as any)}{' '}
                            </FormLabel>
                            <FormControl>
                              <Input
                                className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                                placeholder={t('user.enter_first_name' as any)}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='lastName'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-xs font-bold'>
                              {t('user.last_name' as any)}{' '}
                            </FormLabel>
                            <FormControl>
                              <Input
                                className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                                placeholder={t('user.enter_last_name' as any)}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='phone'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-xs font-bold'>
                              {t('user.phone' as any)}
                            </FormLabel>
                            <FormControl>
                              <Input
                                className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                                placeholder={t('user.enter_phone' as any)}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='email'
                        disabled={!!initialData}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-xs font-bold'>
                              {t('user.email' as any)}{' '}
                            </FormLabel>
                            <FormControl>
                              <Input
                                className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                                placeholder={t('user.enter_email' as any)}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='unit'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-xs font-bold'>
                              {t('user.unit_label' as any)}
                            </FormLabel>
                            <FormControl>
                              <MultiSelect
                                options={[
                                  {
                                    value: 'team:support',
                                    label: 'Team Support'
                                  },
                                  {
                                    value: 'team:technical',
                                    label: 'Team Technical'
                                  }
                                ]}
                                defaultValue={field.value ?? []}
                                onValueChange={field.onChange}
                                placeholder={t('user.select_unit' as any)}
                                resetOnDefaultValueChange
                                singleLine
                                className='dark:bg-input/30 dark:disabled:bg-gray-5 flex h-auto !min-h-[31px] !w-full !max-w-full !min-w-0 gap-1 !rounded-[4px]'
                                popoverClassName='
                                w-[var(--radix-popover-trigger-width)]
                                max-w-[95vw]
                                sm:max-w-none
                              '
                                autoSize
                                textSize='!text-xs'
                                hideSelectAll
                                hideXIcon={true}
                                disabled={isView}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='department'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-xs font-bold'>
                              {t('user.department_label' as any)}
                            </FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                disabled={isView}
                              >
                                <SelectTrigger className='!h-[31px] w-full !rounded-[4px] px-2 text-xs leading-[15px] shadow-none'>
                                  <SelectValue
                                    placeholder={t(
                                      'user.select_department' as any
                                    )}
                                  />
                                </SelectTrigger>
                                <SelectContent className='max-h-[240px] [&_[data-slot=select-item]]:text-xs'>
                                  <SelectItem value='test'>test</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='address'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-xs font-bold'>
                              {t('user.address' as any)}
                            </FormLabel>
                            <FormControl>
                              <Input
                                className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                                placeholder={t('user.enter_address' as any)}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='note'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-xs font-bold'>
                              {t('user.note' as any)}
                            </FormLabel>
                            <FormControl>
                              <Input
                                className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                                placeholder={t('user.enter_note' as any)}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <h3 className='pt-2.5 pb-2 text-[16px] font-bold'>
                      {t('user.account_info' as any)}
                    </h3>
                    <div className='grid grid-cols-2 gap-x-3 md:grid-cols-3'>
                      <FormField
                        control={form.control}
                        disabled={!!initialData}
                        name='username'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-xs font-bold'>
                              {t('user.username' as any)}{' '}
                            </FormLabel>
                            <FormControl>
                              <Input
                                className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                                placeholder={t('user.enter_username' as any)}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {!initialData ? (
                        <>
                          <FormField
                            control={form.control}
                            name='password'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className='justify-between text-xs font-bold'>
                                  <span>{t('user.password' as any)}</span>
                                  {initialData && (
                                    <>
                                      <Image
                                        src={'/assets/icons/edit.svg'}
                                        alt='edit'
                                        width={12}
                                        height={12}
                                        className='cursor-pointer'
                                        onClick={() => setOpen(!open)}
                                      />
                                    </>
                                  )}
                                </FormLabel>

                                <div className='relative'>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      type={showPassword ? 'text' : 'password'}
                                      placeholder={t(
                                        'user.enter_password' as any
                                      )}
                                      className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                                    />
                                  </FormControl>
                                  <button
                                    type='button'
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
                                    className='absolute inset-y-0 right-0 flex items-center pr-3'
                                  >
                                    {showPassword ? (
                                      <EyeOff className='h-3 w-3 text-gray-400' />
                                    ) : (
                                      <Eye className='h-3 w-3 text-gray-400' />
                                    )}
                                  </button>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name='confirmPassword'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className='text-xs font-bold'>
                                  {t('user.confirm_password' as any)}{' '}
                                </FormLabel>

                                <div className='relative'>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      type={
                                        showConfirmPassword
                                          ? 'text'
                                          : 'password'
                                      }
                                      placeholder={t(
                                        'user.re_enter_password' as any
                                      )}
                                      className='!h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs'
                                    />
                                  </FormControl>
                                  <button
                                    type='button'
                                    onClick={() =>
                                      setShowConfirmPassword(
                                        !showConfirmPassword
                                      )
                                    }
                                    className='absolute inset-y-0 right-0 flex items-center pr-3'
                                  >
                                    {showConfirmPassword ? (
                                      <EyeOff className='h-3 w-3 text-gray-400' />
                                    ) : (
                                      <Eye className='h-3 w-3 text-gray-400' />
                                    )}
                                  </button>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      ) : !isView ? (
                        <div className='flex items-center'>
                          <Button
                            type='button'
                            className='mt-6 h-[31px] rounded-[4px] border-1 text-xs'
                            variant={'ghost'}
                            onClick={() => setOpen(!open)}
                          >
                            {t('user.reset_password' as any)}
                          </Button>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>

                    {/* Advanced Section: Dynamic Role & Branch Blocks */}
                    <div className='bg-muted/20 dark:bg-muted/10 mt-6 space-y-4 rounded-lg border p-4'>
                      <div className='flex items-center justify-between border-b pb-3'>
                        <div>
                          <h3 className='flex items-center gap-2 text-[15px] font-bold text-gray-900 dark:text-gray-100'>
                            <ShieldCheck className='text-primary h-4 w-4' />
                            Phân quyền & Chi nhánh (Nâng cao)
                          </h3>
                          <p className='text-muted-foreground mt-0.5 text-xs'>
                            Gán các vai trò và phạm vi chi nhánh áp dụng cho
                            người dùng này.
                          </p>
                        </div>
                        {!isView && (
                          <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            className='h-8 gap-1.5 text-xs'
                            onClick={handleAddBlock}
                          >
                            <Plus className='h-3.5 w-3.5' />
                            Thêm phân quyền
                          </Button>
                        )}
                      </div>

                      <div className='space-y-3.5'>
                        {blocks.length === 0 ? (
                          <div className='bg-card/50 flex flex-col items-center justify-center space-y-2 rounded-lg border border-dashed p-4 py-6 text-center'>
                            <p className='text-muted-foreground text-xs'>
                              Chưa có cấu hình phân quyền nào cho người dùng
                              này.
                            </p>
                            {!isView && (
                              <Button
                                type='button'
                                variant='outline'
                                size='sm'
                                className='h-7 gap-1 text-xs'
                                onClick={handleAddBlock}
                              >
                                <Plus className='h-3.5 w-3.5' />
                                Thêm phân quyền
                              </Button>
                            )}
                          </div>
                        ) : (
                          blocks.map((block, index) => (
                            <div
                              key={block.id}
                              className='bg-card relative space-y-3 rounded-lg border p-3.5 shadow-sm'
                            >
                              <div className='flex items-center justify-between border-b pb-2'>
                                <span className='text-primary text-xs font-bold'>
                                  Cấu hình phân quyền #{index + 1}
                                </span>
                                {!isView && (
                                  <Button
                                    type='button'
                                    variant='ghost'
                                    size='icon'
                                    className='text-muted-foreground hover:text-destructive h-7 w-7'
                                    onClick={() => handleRemoveBlock(block.id)}
                                    title='Xóa cấu hình này'
                                  >
                                    <Trash2 className='h-4 w-4' />
                                  </Button>
                                )}
                              </div>

                              <div className='grid grid-cols-1 items-start gap-3 sm:grid-cols-2'>
                                {/* Role Selector Column */}
                                <div>
                                  <div className='mb-1.5 flex h-5 items-center justify-between'>
                                    <Label className='block text-xs font-bold'>
                                      {t('user.role_label' as any)}
                                    </Label>

                                    {/* Floating Popover Preview without Layout Shift */}
                                    {block.roleId && (
                                      <RolePermissionsPopover
                                        roleId={block.roleId}
                                        roles={rolesData?.['ui-roles']}
                                      />
                                    )}
                                  </div>
                                  <Select
                                    value={block.roleId}
                                    onValueChange={(val) =>
                                      handleBlockChange(block.id, 'roleId', val)
                                    }
                                    disabled={isLoadingRoles || isView}
                                  >
                                    <SelectTrigger className='!h-[31px] w-full !rounded-[4px] px-2 text-xs shadow-none'>
                                      <SelectValue
                                        placeholder={
                                          isLoadingRoles
                                            ? t('user.loading' as any)
                                            : t('user.select_role' as any)
                                        }
                                      />
                                    </SelectTrigger>
                                    <SelectContent className='max-h-[240px] [&_[data-slot=select-item]]:text-xs'>
                                      {roleOptions.map((role) => (
                                        <SelectItem
                                          key={role.value}
                                          value={role.value}
                                        >
                                          {role.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                {/* Branch Selector Column */}
                                <div>
                                  <div className='mb-1.5 flex h-5 items-center justify-between'>
                                    <Label className='block text-xs font-bold'>
                                      Phạm vi chi nhánh
                                    </Label>
                                  </div>
                                  <div className='flex items-center gap-2'>
                                    <Select
                                      value={
                                        block.branchId === 'all'
                                          ? 'all'
                                          : 'specific'
                                      }
                                      onValueChange={(val) => {
                                        if (val === 'all') {
                                          handleBlockChange(
                                            block.id,
                                            'branchId',
                                            'all'
                                          );
                                        } else {
                                          handleBlockChange(
                                            block.id,
                                            'branchId',
                                            ''
                                          );
                                        }
                                      }}
                                      disabled={isView}
                                    >
                                      <SelectTrigger
                                        className={cn(
                                          '!h-[31px] !rounded-[4px] px-2 text-xs shadow-none',
                                          block.branchId === 'all'
                                            ? 'w-full'
                                            : 'w-36 flex-shrink-0'
                                        )}
                                      >
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent className='[&_[data-slot=select-item]]:text-xs'>
                                        <SelectItem value='all'>
                                          Tất cả chi nhánh
                                        </SelectItem>
                                        <SelectItem value='specific'>
                                          Chi nhánh cụ thể
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>

                                    {block.branchId !== 'all' && (
                                      <div className='min-w-0 flex-1'>
                                        <TreeProvider
                                          disabled={isView}
                                          onRegionChange={(region) => {
                                            handleBlockChange(
                                              block.id,
                                              'branchId',
                                              region?.id ?? ''
                                            );
                                            if (region?.name) {
                                              handleBlockChange(
                                                block.id,
                                                'branchName',
                                                region.name
                                              );
                                            }
                                          }}
                                          selectedRegion={
                                            block.branchId &&
                                            block.branchId !== 'all'
                                              ? {
                                                  id: block.branchId,
                                                  name:
                                                    block.branchName ||
                                                    findRegionName(
                                                      treeData,
                                                      block.branchId
                                                    ) ||
                                                    'Chi nhánh'
                                                }
                                              : undefined
                                          }
                                          className='dark:bg-input/30 !h-[31px] !w-full !text-xs'
                                          buttonClassName='!rounded-[4px] dark:disabled:bg-gray-5 dark:hover:bg-input/50'
                                          insideClassName='dark:bg-action'
                                          treeClassName='!w-full !rounded-[4px]'
                                          showSelectAll={false}
                                          closeOnClickOutside={true}
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className='mt-5 flex h-[30px] items-center justify-end gap-4'>
                  <Button
                    onClick={onClose}
                    variant={'outline'}
                    type='button'
                    className='h-full w-16 rounded-[4px] text-xs'
                    disabled={isSubmitting}
                  >
                    {isView ? t('user.close' as any) : t('user.cancel' as any)}
                  </Button>
                  {!isView && (
                    <Button
                      type='submit'
                      className='h-full w-[91px] rounded-[4px] text-xs'
                      disabled={isSubmitting}
                    >
                      {isSubmitting && (
                        <Loader2 className='mr-1.5 h-3.5 w-3.5 animate-spin' />
                      )}
                      {t('user.save' as any)}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
            {initialData && (
              <>
                <ChangepassDialog
                  open={open}
                  onOpenChange={setOpen}
                  userId={initialData.id}
                />
              </>
            )}
          </FormSchemaProvider>
        </CardContent>
      </Card>
    </CustomScrollbar>
  );
}
