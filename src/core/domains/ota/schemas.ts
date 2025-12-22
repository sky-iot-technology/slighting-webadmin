import { z } from 'zod';

const otaBaseSchema = z.object({
  name: z.string().min(1, 'Tên OTA không được để trống'),
  category_type: z.string().min(1, 'Loại thiết bị không được để trống'),
  version: z.string().min(1, 'Phiên bản không được để trống'),
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
        message: 'Vui lòng chọn tệp OTA',
        code: z.ZodIssueCode.custom
      });
      return;
    }

    if (data.file.size > 5 * 1024 * 1024) {
      ctx.addIssue({
        path: ['file'],
        message: 'File không vượt quá 5MB',
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
        message: 'File không hợp lệ',
        code: z.ZodIssueCode.custom
      });
      return;
    }

    if (data.file.size > 5 * 1024 * 1024) {
      ctx.addIssue({
        path: ['file'],
        message: 'File không vượt quá 5MB',
        code: z.ZodIssueCode.custom
      });
    }
  });

export type OtaFormSchema = z.infer<typeof otaFormSchema>;
export type OtaUpdateFormSchema = z.infer<typeof otaUpdateSchema>;
