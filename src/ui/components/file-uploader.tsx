'use client';

import { IconX, IconUpload, IconUser } from '@tabler/icons-react';
import Image from 'next/image';
import * as React from 'react';
import Dropzone, {
  type DropzoneProps,
  type FileRejection
} from 'react-dropzone';
import { toast } from 'sonner';

import { Button } from '@/ui/components/ui/button';
import { Progress } from '@/ui/components/ui/progress';
import { ScrollArea } from '@/ui/components/ui/scroll-area';
import { useControllableState } from '@/core/shared/hooks/use-controllable-state';
import { cn, formatBytes } from '@/lib/utils';
import { useTranslation } from '@/core/domains/language/useTranslation';

interface FileUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Value of the uploader.
   * @type File[]
   * @default undefined
   * @example value={files}
   */
  value?: File[];

  /**
   * Function to be called when the value changes.
   * @type React.Dispatch<React.SetStateAction<File[]>>
   * @default undefined
   * @example onValueChange={(files) => setFiles(files)}
   */
  onValueChange?: React.Dispatch<React.SetStateAction<File[]>>;

  /**
   * Function to be called when files are uploaded.
   * @type (files: File[]) => Promise<void>
   * @default undefined
   * @example onUpload={(files) => uploadFiles(files)}
   */
  onUpload?: (files: File[]) => Promise<void>;

  /**
   * Progress of the uploaded files.
   * @type Record<string, number> | undefined
   * @default undefined
   * @example progresses={{ "file1.png": 50 }}
   */
  progresses?: Record<string, number>;

  /**
   * Accepted file types for the uploader.
   * @type { [key: string]: string[]}
   * @default
   * ```ts
   * { "image/*": [] }
   * ```
   * @example accept={["image/png", "image/jpeg"]}
   */
  accept?: DropzoneProps['accept'];

  /**
   * Maximum file size for the uploader.
   * @type number | undefined
   * @default 1024 * 1024 * 2 // 2MB
   * @example maxSize={1024 * 1024 * 2} // 2MB
   */
  maxSize?: DropzoneProps['maxSize'];

  /**
   * Maximum number of files for the uploader.
   * @type number | undefined
   * @default 1
   * @example maxFiles={5}
   */
  maxFiles?: DropzoneProps['maxFiles'];

  /**
   * Whether the uploader should accept multiple files.
   * @type boolean
   * @default false
   * @example multiple
   */
  multiple?: boolean;

  /**
   * Whether the uploader is disabled.
   * @type boolean
   * @default false
   * @example disabled
   */
  disabled?: boolean;
}

export function FileUploader(props: FileUploaderProps) {
  const {
    value: valueProp,
    onValueChange,
    onUpload,
    progresses,
    accept = { 'image/*': [] },
    maxSize = 1024 * 1024 * 2,
    maxFiles = 1,
    multiple = false,
    disabled = false,
    className,
    ...dropzoneProps
  } = props;

  const [files, setFiles] = useControllableState({
    prop: valueProp,
    onChange: onValueChange
  });
  const { t, tTime } = useTranslation();

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (!multiple && maxFiles === 1 && acceptedFiles.length > 1) {
        toast.error(t('general.file_upload_error_single' as any));
        return;
      }

      if ((files?.length ?? 0) + acceptedFiles.length > maxFiles) {
        toast.error(
          tTime('general.file_upload_error_max_files' as any, {
            count: maxFiles
          })
        );
        return;
      }

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      );

      const updatedFiles = files ? [...files, ...newFiles] : newFiles;

      setFiles(updatedFiles);

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file }) => {
          toast.error(
            tTime('general.file_rejected' as any, { filename: file.name })
          );
        });
      }

      if (
        onUpload &&
        updatedFiles.length > 0 &&
        updatedFiles.length <= maxFiles
      ) {
        const target =
          updatedFiles.length > 0 ? `${updatedFiles.length} files` : `file`;

        toast.promise(onUpload(updatedFiles), {
          loading: tTime('general.uploading_target' as any, { target }),
          success: () => {
            setFiles([]);
            return tTime('general.upload_success' as any, { target });
          },
          error: tTime('general.upload_failed' as any, { target })
        });
      }
    },

    [files, maxFiles, multiple, onUpload, setFiles]
  );

  function onRemove(index: number) {
    if (!files) return;
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onValueChange?.(newFiles);
  }

  // Revoke preview url when component unmounts
  React.useEffect(() => {
    return () => {
      if (!files) return;
      files.forEach((file) => {
        if (isFileWithPreview(file)) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDisabled = disabled || (files?.length ?? 0) >= maxFiles;

  return (
    <div className='relative flex flex-col gap-6 overflow-hidden'>
      <Dropzone
        onDrop={onDrop}
        accept={accept}
        maxSize={maxSize}
        maxFiles={maxFiles}
        multiple={maxFiles > 1 || multiple}
        disabled={isDisabled}
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div
            {...getRootProps()}
            className={cn(
              'group border-muted-foreground/25 hover:bg-muted/25 relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed px-5 py-2.5 text-center transition',
              'ring-offset-background focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden',
              isDragActive && 'border-muted-foreground/50',
              isDisabled && 'pointer-events-none opacity-60',
              className
            )}
            {...dropzoneProps}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <div className='flex flex-col items-center justify-center gap-4 sm:px-5'>
                <div className='rounded-full border border-dashed p-3'>
                  <IconUpload
                    className='text-muted-foreground size-7'
                    aria-hidden='true'
                  />
                </div>
                <p className='text-muted-foreground font-medium'>
                  {t('general.drop_files_here' as any)}
                </p>
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center gap-4 sm:px-5'>
                <div className='rounded-full border border-dashed p-3'>
                  <IconUpload
                    className='text-muted-foreground size-7'
                    aria-hidden='true'
                  />
                </div>
                <div className='space-y-px'>
                  <p className='text-muted-foreground font-medium'>
                    {t('general.drag_drop_files' as any)}
                  </p>
                  <p className='text-muted-foreground/70 text-sm'>
                    {maxFiles > 1
                      ? tTime('general.upload_info_multiple' as any, {
                          count: maxFiles === Infinity ? 'multiple' : maxFiles,
                          size: formatBytes(maxSize)
                        })
                      : tTime('general.upload_info_single' as any, {
                          size: formatBytes(maxSize)
                        })}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Dropzone>
      {files?.length ? (
        <ScrollArea className='h-fit w-full px-3'>
          <div className='max-h-48 space-y-4'>
            {files?.map((file, index) => (
              <FileCard
                key={index}
                file={file}
                onRemove={() => onRemove(index)}
                progress={progresses?.[file.name]}
                t={t}
              />
            ))}
          </div>
        </ScrollArea>
      ) : null}
    </div>
  );
}

interface FileCardProps {
  file: File;
  onRemove: () => void;
  progress?: number;
  t: any;
}

function FileCard({ file, progress, onRemove, t }: FileCardProps) {
  return (
    <div className='relative flex items-center space-x-4'>
      <div className='flex flex-1 space-x-4'>
        {isFileWithPreview(file) ? (
          <Image
            src={file.preview}
            alt={file.name}
            width={48}
            height={48}
            loading='lazy'
            className='aspect-square shrink-0 rounded-md object-cover'
          />
        ) : null}
        <div className='flex w-full flex-col gap-2'>
          <div className='space-y-px'>
            <p className='text-foreground/80 line-clamp-1 text-sm font-medium'>
              {file.name}
            </p>
            <p className='text-muted-foreground text-xs'>
              {formatBytes(file.size)}
            </p>
          </div>
          {progress ? <Progress value={progress} /> : null}
        </div>
      </div>
      <div className='flex items-center gap-2'>
        <Button
          type='button'
          variant='ghost'
          size='icon'
          onClick={onRemove}
          disabled={progress !== undefined && progress < 100}
          className='size-8 rounded-full'
        >
          <IconX className='text-muted-foreground' />
          <span className='sr-only'>{t('general.remove_file' as any)}</span>
        </Button>
      </div>
    </div>
  );
}

function isFileWithPreview(file: File): file is File & { preview: string } {
  return 'preview' in file && typeof file.preview === 'string';
}

interface AvatarUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: File;
  onValueChange?: (file: File | null) => void;
  onUpload?: (file: File) => Promise<void>;
  size?: number;
  disabled?: boolean;
}

export function AvatarUploader(props: AvatarUploaderProps) {
  const {
    value: valueProp,
    onValueChange,
    onUpload,
    disabled = false,
    className,
    ...dropzoneProps
  } = props;
  const { t, tTime } = useTranslation();

  const [file, setFile] = useControllableState<File | null>({
    prop: valueProp,
    onChange: onValueChange
  });

  const onDrop = React.useCallback(
    async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (!acceptedFiles.length) return;

      const selected = Object.assign(acceptedFiles[0], {
        preview: URL.createObjectURL(acceptedFiles[0])
      });

      setFile(selected);

      if (rejectedFiles.length) {
        toast.error(
          tTime('general.file_rejected' as any, {
            filename: rejectedFiles[0].file.name
          })
        );
      }

      if (onUpload) {
        toast.promise(onUpload(selected), {
          loading: t('general.uploading_avatar' as any),
          success: t('general.avatar_updated' as any),
          error: t('general.upload_failed_avatar' as any)
        });
      }
    },
    [onUpload, setFile]
  );

  React.useEffect(() => {
    return () => {
      if (file && isFileWithPreview(file)) {
        URL.revokeObjectURL(file.preview);
      }
    };
  }, [file]);

  return (
    <Dropzone
      accept={{ 'image/*': [] }}
      maxFiles={1}
      multiple={false}
      disabled={disabled}
      onDrop={onDrop}
    >
      {({ getRootProps, getInputProps, isDragActive }) => (
        <div
          {...getRootProps()}
          {...dropzoneProps}
          className={cn(
            'group border-muted-foreground/25 hover:bg-muted/25 relative grid h-52 w-full cursor-pointer place-items-center overflow-hidden rounded-lg border-2 border-dashed px-5 py-2.5 text-center transition',
            'ring-offset-background focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden',
            isDragActive && 'border-muted-foreground/50',
            disabled && 'pointer-events-none opacity-60',
            className
          )}
        >
          <input {...getInputProps()} />

          {file && isFileWithPreview(file) ? (
            <>
              <Image
                src={file.preview}
                width={180}
                height={180}
                alt='Avatar'
                className='h-full w-full object-cover'
              />

              {/* ✅ Nút X xoá */}
              <button
                type='button'
                className='bg-background/80 hover:bg-background absolute top-2 right-2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full shadow-sm backdrop-blur'
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setFile(null);
                  onValueChange?.(null);
                }}
                aria-label={t('general.remove_avatar' as any)}
              >
                <IconX className='text-muted-foreground h-4 w-4' />
              </button>
            </>
          ) : isDragActive ? (
            <div className='flex flex-col items-center justify-center gap-4 sm:px-5'>
              <div className='rounded-full border border-dashed p-3'>
                <IconUpload
                  className='text-muted-foreground size-7'
                  aria-hidden='true'
                />
              </div>
              <p className='text-muted-foreground font-medium'>
                {t('general.drop_files_here' as any)}
              </p>
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center gap-4 sm:px-5'>
              <div className='rounded-full border border-dashed p-3'>
                <IconUpload
                  className='text-muted-foreground size-7'
                  aria-hidden='true'
                />
              </div>
              <div className='space-y-px'>
                <p className='text-muted-foreground font-medium'>
                  {t('general.drag_drop_avatar' as any)}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </Dropzone>
  );
}
