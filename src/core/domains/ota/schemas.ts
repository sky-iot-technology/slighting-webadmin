import { z } from 'zod';

const otaBaseSchema = z.object({
  name: z.string().min(1, 'ota.validation.name_required'),
  category_type: z.string().min(1, 'ota.validation.category_required'),
  version: z.string().min(1, 'ota.validation.version_required'),
  description: z.string().optional()
});

export const otaFormSchema = otaBaseSchema
  .extend({
    file: z.any()
  })
  .superRefine((data, ctx) => {
    if (!(data.file instanceof File)) {
      ctx.addIssue({
        path: ['file'],
        message: 'ota.validation.file_required',
        code: z.ZodIssueCode.custom
      });
      return;
    }

    if (data.file.size > 5 * 1024 * 1024) {
      ctx.addIssue({
        path: ['file'],
        message: 'ota.validation.file_size_max',
        code: z.ZodIssueCode.custom
      });
    }
  });

export const otaUpdateSchema = otaBaseSchema
  .extend({
    file: z.any().optional()
  })
  .superRefine((data, ctx) => {
    if (data.file === undefined) {
      return;
    }

    if (!(data.file instanceof File)) {
      ctx.addIssue({
        path: ['file'],
        message: 'ota.validation.file_invalid',
        code: z.ZodIssueCode.custom
      });
      return;
    }

    if (data.file.size > 5 * 1024 * 1024) {
      ctx.addIssue({
        path: ['file'],
        message: 'ota.validation.file_size_max',
        code: z.ZodIssueCode.custom
      });
    }
  });

export type OtaFormSchema = z.infer<typeof otaFormSchema>;
export type OtaUpdateFormSchema = z.infer<typeof otaUpdateSchema>;
