import { ImageIcon, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import CustomScrollbar from './custom-scrollbar';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription } from './ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useTranslation } from '@/core/domains/language/useTranslation';

type ExistingFile = {
  file_name: string;
  file_url: string;
};

type ImageUploadProps = {
  value?: File[];
  onChange?: (files: File[]) => void;

  existingImages?: ExistingFile[];
  onRemoveExisting?: (img: ExistingFile) => void;

  multiple?: boolean;
  maxImages?: number;
  maxHeight?: number;
  className?: string;
  maxFiles?: number;
  disabled?: boolean;
};

export function ImageUpload({
  value,
  onChange,
  multiple = true,
  maxImages = 5,
  maxHeight = 160,
  className = '',
  disabled = false,
  existingImages = [],
  onRemoveExisting
}: ImageUploadProps) {
  const { t } = useTranslation();
  const [images, setImages] = useState<File[]>([]);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  const totalImages = images.length + existingImages.length;
  const isMaxReached = totalImages >= maxImages;
  const isUploadDisabled = disabled || isMaxReached;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selected = Array.from(e.target.files);
    const remaining = maxImages - totalImages;
    if (remaining <= 0) return;

    const next = multiple
      ? [...images, ...selected.slice(0, remaining)]
      : selected.slice(0, 1);

    setImages(next);
    onChange?.(next);
    e.target.value = '';
  };

  const handleRemove = (name: string) => {
    const next = images.filter((img) => img.name !== name);
    setImages(next);
    onChange?.(next);
  };

  useEffect(() => {
    if (value) setImages(value);
  }, [value]);

  const hasAnyImages = existingImages.length > 0 || images.length > 0;

  return (
    <>
      <div className={cn('flex flex-col gap-1', className)}>
        {/* ✅ Upload button */}
        {!isUploadDisabled && (
          <label
            htmlFor='image-upload'
            className='hover:bg-accent dark:bg-gray-5 flex w-fit cursor-pointer items-center rounded-[4px] border px-3 py-1.5 text-xs transition-colors'
          >
            <Upload className='mr-2 h-3 w-3' />
            {t('general.choose_picture')}
          </label>
        )}

        <input
          id='image-upload'
          type='file'
          multiple={multiple}
          accept='image/*'
          onChange={handleChange}
          className='hidden'
        />

        {/* ✅ IMAGE GRID + SCROLL */}
        {hasAnyImages ? (
          <div
            className='mt-1 overflow-hidden rounded-[6px]'
            style={{ maxHeight }}
          >
            <CustomScrollbar className='overflow-y-auto' style={{ maxHeight }}>
              <div className='grid grid-cols-3 gap-2 p-1'>
                {/* Existing images */}
                {existingImages.map((img) => (
                  <ImageCard
                    key={img.file_url}
                    src={img.file_url}
                    alt={img.file_name}
                    removable={!disabled}
                    disabled={disabled}
                    onRemove={() => onRemoveExisting?.(img)}
                    onClick={() => setPreviewSrc(img.file_url)}
                  />
                ))}

                {/* New images */}
                {images.map((file) => (
                  <ImageCard
                    key={file.name}
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    removable
                    disabled={disabled}
                    onRemove={() => handleRemove(file.name)}
                    onClick={() => setPreviewSrc(URL.createObjectURL(file))}
                  />
                ))}
              </div>
            </CustomScrollbar>
          </div>
        ) : (
          /* ✅ Placeholder */
          <div className='mt-1 grid grid-cols-3 gap-2'>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className='border-muted bg-muted/30 dark:bg-gray-5 flex aspect-square h-[105px] w-full items-center justify-center rounded-[6px] border'
              >
                <ImageIcon className='text-muted-foreground h-5 w-5' />
              </div>
            ))}
          </div>
        )}
        <Dialog open={!!previewSrc} onOpenChange={() => setPreviewSrc(null)}>
          <DialogTitle className='hidden'>Image</DialogTitle>
          <DialogDescription className='hidden'>Image</DialogDescription>
          <DialogContent className='max-h-[90vh] min-h-[300px] max-w-[90vw] min-w-[300px] p-0'>
            {previewSrc && (
              <div className='relative h-[80vh] w-full'>
                <Image
                  src={previewSrc}
                  alt='preview'
                  fill
                  className='object-contain'
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

const ImageCard = ({
  src,
  alt,
  removable,
  onRemove,
  disabled,
  onClick
}: {
  src: string;
  alt?: string;
  removable?: boolean;
  onRemove?: () => void;
  disabled?: boolean;
  onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    className={cn(
      'bg-muted relative aspect-square h-[105px] w-full cursor-pointer overflow-hidden rounded-[6px] border',
      disabled && 'cursor-default'
    )}
  >
    <Image src={src} alt={alt ?? ''} fill className='object-cover' />
    {removable && (
      <button
        type='button'
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation();
          onRemove?.();
        }}
        className={cn(
          'absolute top-1 right-1 rounded-full bg-white/70 p-[2px]',
          disabled ? 'cursor-not-allowed opacity-40' : 'hover:bg-destructive/20'
        )}
      >
        <X className='text-destructive h-3 w-3' />
      </button>
    )}
  </div>
);
