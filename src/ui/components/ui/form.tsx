'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues
} from 'react-hook-form';
import { z } from 'zod';

import { cn } from '@/lib/utils';
import { Label } from '@/ui/components/ui/label';
import { useTranslation } from '@/core/domains/language/useTranslation';
import { LanguageKey } from '@/core/i18n/locales';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from './tooltip';
import { CircleAlert } from 'lucide-react';
import { IconAlertCircleFilled } from '@tabler/icons-react';
import Image from 'next/image';

const Form = FormProvider;

// Create a context to store the schema
const FormSchemaContext = React.createContext<z.ZodTypeAny | null>(null);

// Custom hook to access the schema
function useSchema() {
  return React.useContext(FormSchemaContext);
}

// Schema provider component
function FormSchemaProvider({
  schema,
  children
}: {
  schema: z.ZodTypeAny;
  children: React.ReactNode;
}) {
  return (
    <FormSchemaContext.Provider value={schema}>
      {children}
    </FormSchemaContext.Provider>
  );
}

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

function FormItem({ className, ...props }: React.ComponentProps<'div'>) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot='form-item'
        className={cn('mt-2.5 mb-2.5 grid gap-2', className)}
        {...props}
      />
    </FormItemContext.Provider>
  );
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  const { error, formItemId } = useFormField();
  const fieldContext = React.useContext(FormFieldContext);
  const schema = useSchema();
  const { t } = useTranslation();

  // Check if the field is required based on the schema
  const isRequired =
    schema && fieldContext?.name
      ? isFieldRequired(schema, fieldContext.name as string)
      : false;

  return (
    <Label
      data-slot='form-label'
      data-error={!!error}
      className={cn(
        'data-[error=true]:text-destructive flex items-center justify-between',
        className
      )}
      htmlFor={formItemId}
      {...props}
    >
      <span className='flex'>
        {props.children}
        {isRequired && <span className='text-destructive ml-1'>*</span>}
      </span>
      {error && (
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Image
                alt='Error icon'
                src='/assets/icons/alert-circle.svg'
                width={16}
                height={16}
              />
            </TooltipTrigger>
            <TooltipContent
              side='left'
              sideOffset={4}
              className='border-red-1 bg-red-1 !rounded-xs text-white'
            >
              <div className='flex flex-col gap-1'>
                {getErrorMessages(error).map((msg, index) => (
                  <p key={index}>{t(msg as LanguageKey) ?? msg}</p>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </Label>
  );
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      data-slot='form-control'
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
}

function FormDescription({ className, ...props }: React.ComponentProps<'p'>) {
  const { formDescriptionId } = useFormField();

  return (
    <p
      data-slot='form-description'
      id={formDescriptionId}
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

// Helper to recursively get all error messages
function getErrorMessages(error: any): string[] {
  if (!error) return [];
  if (typeof error === 'string') return [error];
  if (error.message) return [error.message];

  if (Array.isArray(error)) {
    return error.flatMap(getErrorMessages);
  }

  if (typeof error === 'object') {
    return Object.values(error).flatMap(getErrorMessages);
  }

  return [];
}

function FormMessage({
  className,
  force,
  ...props
}: React.ComponentProps<'p'> & { force?: boolean }) {
  const { error, formMessageId } = useFormField();
  const { t } = useTranslation();

  if (!force || !error) {
    return null;
  }

  const messages = getErrorMessages(error);

  return null;
}

// Helper function to check if a field is required in the Zod schema
function isFieldRequired(schema: z.ZodTypeAny, fieldName: string): boolean {
  if (!schema || !fieldName) return false;

  try {
    let currentSchema: any = schema;
    const parts = fieldName.split('.');

    for (const part of parts) {
      if (!currentSchema) return false;

      // Handle ZodEffects/Optional/Nullable wrappers to retrieve inner object
      while (
        currentSchema._def?.typeName === 'ZodEffects' ||
        currentSchema._def?.typeName === 'ZodOptional' ||
        currentSchema._def?.typeName === 'ZodNullable' ||
        currentSchema._def?.typeName === 'ZodDefault'
      ) {
        if (currentSchema._def.schema) {
          currentSchema = currentSchema._def.schema;
        } else if (currentSchema._def.innerType) {
          currentSchema = currentSchema._def.innerType;
        } else {
          break;
        }
      }

      // If it's an object, access the shape
      if (currentSchema._def?.typeName === 'ZodObject') {
        const shape = currentSchema.shape || currentSchema._def.shape();
        currentSchema = shape[part];
      } else if (
        currentSchema._def?.typeName === 'ZodArray' &&
        !isNaN(Number(part))
      ) {
        // Handle array access if needed (though usually fieldName for arrays is "items.0")
        // ZodArray schema applies to all items
        currentSchema = currentSchema.element;
      } else {
        // Can't traverse further
        return false;
      }
    }

    if (!currentSchema) return false;

    // Check if the final field schema is optional
    const optional = isOptionalField(currentSchema);

    return !optional;
  } catch (error) {
    console.error('isFieldRequired error', error);
    return false;
  }
}

// Helper function to determine if a field is optional
function isOptionalField(fieldSchema: any): boolean {
  if (!fieldSchema) return false;

  // If the field is wrapped with .optional()
  if (fieldSchema._def?.typeName === 'ZodOptional') {
    return true;
  }

  // Handle ZodEffects (transformations, refinements, etc.) by checking the inner schema
  if (
    fieldSchema._def?.typeName === 'ZodEffects' ||
    fieldSchema._def?.typeName === 'ZodDefault'
  ) {
    // Check the inner type/schema
    const innerSchema = fieldSchema._def.schema || fieldSchema._def.innerType;
    if (innerSchema) {
      return isOptionalField(innerSchema);
    }
  }

  // If the field is nullable but not optional
  if (fieldSchema._def?.typeName === 'ZodNullable') {
    // Check the inner type
    return isOptionalField(fieldSchema._def.innerType);
  }

  // Other complex cases like union types that include undefined
  if (fieldSchema._def?.typeName === 'ZodUnion') {
    return fieldSchema._def.options.some(
      (option: any) =>
        option._def.typeName === 'ZodUndefined' ||
        option._def.typeName === 'ZodNull'
    );
  }

  return false;
}

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormSchemaProvider,
  useFormField,
  useSchema
};
