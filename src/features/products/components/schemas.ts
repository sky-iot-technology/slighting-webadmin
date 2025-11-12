import * as z from 'zod';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

// Asset attribute schema
const assetAttributeSchema = z.object({
  index: z.number(),
  is_disabled: z.boolean().default(true),
  identify: z.string(),
  attr: z.string(),
  type: z.number(), // 1: text, 2: date, 3: number
  content: z.union([z.string(), z.number()]),
  reminder_ids: z.array(z.string()).default([])
});

// Device info schema
const deviceInfoSchema = z.object({
  lat: z.number().default(0),
  lon: z.number().default(0),
  online: z.boolean().default(false)
});

// Device asset schema
const deviceAssetSchema = z.object({
  asset_attribute: z.array(assetAttributeSchema)
});

// Main device form schema
export const deviceFormSchema = z.object({
  // Image upload (optional)
  image: z
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
    .optional(),

  // Required fields
  id: z.string().min(1, { message: 'Mã không được bỏ trống' }),
  name: z.string().min(2, { message: 'Tên thiết bị phải có ít nhất 2 ký tự' }),
  type: z.string().min(1, { message: 'Loại thiết bị không được bỏ trống' }),
  parent_group_id: z
    .string()
    .min(1, { message: 'Chi nhánh không được bỏ trống' }),
  serial: z.string().min(1, { message: 'Serial không được bỏ trống' }),

  // Optional fields
  tags: z.array(z.string()).default([]),

  // Device info fields
  device_info: deviceInfoSchema.optional(),
  lat: z
    .number()
    .or(z.string())
    .optional()
    .transform((val) => {
      if (typeof val === 'string') {
        return val === '' ? 0 : parseFloat(val);
      }
      return val || 0;
    }),
  lon: z
    .number()
    .or(z.string())
    .optional()
    .transform((val) => {
      if (typeof val === 'string') {
        return val === '' ? 0 : parseFloat(val);
      }
      return val || 0;
    }),

  // Additional fields
  address: z.string().optional(),
  note: z.string().optional(),

  // Product info (currently not used)
  product_info: z.array(z.any()).default([]),

  // Device asset info
  device_asset: deviceAssetSchema.optional(),

  // Individual asset attribute fields for easier form handling
  installation_date: z.date().or(z.number()).optional(),
  warranty_date: z.date().or(z.number()).optional(),
  expiration_date: z.date().or(z.number()).optional(),
  manufacturer: z.string().optional(),
  service_life: z.date().or(z.number()).optional(),
  expiration_of_tariff: z.date().or(z.number()).optional(),
  purchase_date: z.date().or(z.number()).optional()
});

export type DeviceFormValues = z.infer<typeof deviceFormSchema>;

// Helper function to convert form values to API payload
export function convertFormToApiPayload(
  formValues: DeviceFormValues
): Record<string, any> {
  const asset_attribute: any[] = [];
  let index = 0;

  // Add expiration_date if exists
  if (formValues.expiration_date) {
    asset_attribute.push({
      index: index++,
      is_disabled: true,
      identify: 'expiration_date',
      attr: 'Expiration date',
      type: 2,
      content:
        formValues.expiration_date instanceof Date
          ? Math.floor(formValues.expiration_date.getTime() / 1000)
          : formValues.expiration_date,
      reminder_ids: []
    });
  }

  // Add expiration_of_tariff if exists
  if (formValues.expiration_of_tariff) {
    asset_attribute.push({
      index: index++,
      is_disabled: true,
      identify: 'expiration_of_tariff',
      attr: 'expiration of tariff',
      type: 2,
      content:
        formValues.expiration_of_tariff instanceof Date
          ? Math.floor(formValues.expiration_of_tariff.getTime() / 1000)
          : formValues.expiration_of_tariff,
      reminder_ids: []
    });
  }

  // Add installation_date if exists
  if (formValues.installation_date) {
    asset_attribute.push({
      index: index++,
      is_disabled: true,
      identify: 'installation_date',
      attr: 'Installation date',
      type: 2,
      content:
        formValues.installation_date instanceof Date
          ? Math.floor(formValues.installation_date.getTime() / 1000)
          : formValues.installation_date,
      reminder_ids: []
    });
  }

  // Add purchase_date if exists
  if (formValues.purchase_date) {
    asset_attribute.push({
      index: index++,
      is_disabled: true,
      identify: 'purchase_date',
      attr: 'Purchase date',
      type: 2,
      content:
        formValues.purchase_date instanceof Date
          ? Math.floor(formValues.purchase_date.getTime() / 1000)
          : formValues.purchase_date,
      reminder_ids: []
    });
  }

  // Add service_life if exists
  if (formValues.service_life) {
    asset_attribute.push({
      index: index++,
      is_disabled: true,
      identify: 'service_life',
      attr: 'Service life',
      type: 2,
      content:
        formValues.service_life instanceof Date
          ? Math.floor(formValues.service_life.getTime() / 1000)
          : formValues.service_life,
      reminder_ids: []
    });
  }

  // Add manufacturer if exists
  if (formValues.manufacturer) {
    asset_attribute.push({
      index: index++,
      is_disabled: true,
      identify: 'manufacturer',
      attr: 'Manufacturer',
      type: 1,
      content: formValues.manufacturer,
      reminder_ids: []
    });
  }

  // Build API payload
  return {
    id: formValues.id,
    type: formValues.type,
    // Ensure tags is always an array of strings
    tags: Array.isArray(formValues.tags) ? formValues.tags : [],
    parent_group_id: formValues.parent_group_id,
    name: formValues.name,
    device_info: {
      lat: formValues.lat || 0,
      lon: formValues.lon || 0,
      online: false,
      serial_number: formValues.serial,
      region: formValues.address,
      manufacturer: formValues.manufacturer
    },
    product_info: [],
    device_asset: {
      asset_attribute
    }
  };
}
