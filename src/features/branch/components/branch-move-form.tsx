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
  FormMessage
} from '@/ui/components/ui/form';
import { Button } from '@/ui/components/ui/button';
import { useEffect, useState } from 'react';
import CustomScrollbar from '@/ui/components/custom-scrollbar';
import {
  Group,
  SetChildrenGroupDto,
  useSetChildrenGroup
} from '@/core/domains/groups';
import { useRegionTreeStore } from '@/core/domains/tree/store';
import { findNodeById } from '@/features/calendar/helper';
import { Input } from '@/ui/components/ui/input';
import { toast } from 'sonner';
import { RegionTreeWrapper } from '@/ui/business/tree/RegionTreeWrapper';
import { useTranslation } from '@/core/domains/language/useTranslation';

type BranchMoveFormProps = {
  initialData: Partial<Group>;
  pageTitle: string;
  onClose?: () => void;
};

const branchMoveSchema = z.object({
  parent_id: z.string().optional()
});

type BranchMoveFormValues = z.infer<typeof branchMoveSchema>;

export default function BranchMoveForm({
  initialData,
  onClose,
  pageTitle
}: BranchMoveFormProps) {
  const { t } = useTranslation();
  const { treeData } = useRegionTreeStore();
  const [selectedParent, setSelectedParent] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const form = useForm<BranchMoveFormValues>({
    resolver: zodResolver(branchMoveSchema),
    defaultValues: { parent_id: initialData.parent_id ?? '' }
  });
  useEffect(() => {
    if (initialData?.parent_id && treeData.length > 0) {
      const parentNode = findNodeById(treeData, initialData.parent_id);
      if (parentNode) {
        setSelectedParent({ id: parentNode.id, name: parentNode.name });
        form.setValue('parent_id', parentNode.id);
      }
    }
  }, [initialData?.parent_id, treeData]);

  const updateMutation = useSetChildrenGroup({
    onSuccess: () => {
      if (onClose) onClose();
    }
  });

  const onSubmit = (values: z.infer<typeof branchMoveSchema>) => {
    if (values.parent_id === initialData.id) {
      toast('Update device parent successfully');
      if (onClose) onClose();
      return;
    }
    const payload: SetChildrenGroupDto = {
      parent_id: values.parent_id as string,
      children_ids: [initialData.id as string],
      parent_id_old: initialData.parent_id
    };
    updateMutation.mutate(payload);
  };

  return (
    <CustomScrollbar className='overflow-y-auto p-5.5'>
      <Card className='mx-auto w-full gap-1.5 border-0 py-0 shadow-none'>
        <CardHeader className='px-0'>
          <CardTitle className='text-primary text-left text-[16px] font-bold'>
            {pageTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className='px-0'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className=''>
              <div className='flex justify-between'>
                <FormField
                  control={form.control}
                  name='parent_id'
                  render={({ field }) => (
                    <FormItem className='col-span-2'>
                      <FormLabel className='text-xs font-bold'>
                        {t('branch.current_branch')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          className='disabled:bg-muted !h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs disabled:opacity-100'
                          {...field}
                          value={initialData?.name}
                          disabled
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {selectedParent && (
                  <FormField
                    control={form.control}
                    name='parent_id'
                    render={({ field }) => (
                      <FormItem className='col-span-2'>
                        <FormLabel className='text-xs font-bold'>
                          {t('branch.selected')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            className='disabled:bg-muted !h-[31px] !w-full !rounded-[4px] !text-xs placeholder:text-xs disabled:opacity-100'
                            {...field}
                            value={selectedParent.name}
                            disabled
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <FormField
                control={form.control}
                name='parent_id'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel className='text-xs font-bold'>
                      {t('branch.parent_branch')}
                    </FormLabel>
                    <FormControl>
                      <div className='rounded-[4px] border-1'>
                        <RegionTreeWrapper
                          data={treeData}
                          onSelect={(region) => {
                            if (region?.id === field.value) {
                              field.onChange('');
                              setSelectedParent(null);
                              return;
                            }
                            field.onChange(region?.id ?? '');
                            setSelectedParent(
                              region
                                ? { id: region.id, name: region.name }
                                : null
                            );
                          }}
                          selectedId={field.value}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex h-[30px] items-center justify-end gap-1'>
                <Button
                  onClick={onClose}
                  variant={'outline'}
                  type='button'
                  className='h-full w-16 rounded-[4px] text-xs'
                >
                  {t('branch.cancel')}
                </Button>
                <Button
                  type='submit'
                  className='h-full w-[70px] rounded-[4px] text-xs'
                >
                  {t('branch.save')}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </CustomScrollbar>
  );
}
