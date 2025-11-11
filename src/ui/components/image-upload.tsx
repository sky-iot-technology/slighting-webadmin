import { ImageIcon, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import CustomScrollbar from './custom-scrollbar';

type ImageUploadProps = {
  value?: FileList | null;
  onChange?: (files: FileList | null) => void;
  multiple?: boolean;
  maxImages?: number;
  maxHeight?: number;
  className?: string;
};

export function ImageUpload({
  value,
  onChange,
  multiple = true,
  maxImages = 5,
  maxHeight = 160,
  className = ''
}: ImageUploadProps) {
  const [images, setImages] = useState<File[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);

    const total = [...images, ...selected].slice(0, maxImages);
    setImages(total);
  };

  const handleRemove = (name: string) => {
    setImages((prev) => prev.filter((img) => img.name !== name));
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label
        htmlFor='image-upload'
        className='hover:bg-accent flex w-fit cursor-pointer items-center rounded-[4px] border px-3 py-1.5 transition-colors'
      >
        <Upload className='mr-2 h-3 w-3' />
        <span className='text-xs'>Chọn ảnh</span>
      </label>

      <input
        id='image-upload'
        type='file'
        multiple={multiple}
        accept='image/*'
        onChange={handleChange}
        className='hidden'
      />

      {images.length > 0 ? (
        <div
          className='mt-1 overflow-hidden rounded-[6px]'
          style={{ maxHeight: `${maxHeight}px` }}
        >
          <CustomScrollbar
            className='overflow-y-auto'
            style={{ maxHeight: `${maxHeight}px` }}
          >
            <div className='grid grid-cols-3 gap-2'>
              {images.map((img) => {
                const preview = URL.createObjectURL(img);
                return (
                  <div
                    key={img.name}
                    className='relative aspect-square h-[105px] w-full overflow-hidden rounded-[6px] border'
                  >
                    <Image
                      src={preview}
                      alt={img.name}
                      fill
                      className='object-cover'
                    />
                    <button
                      type='button'
                      onClick={() => handleRemove(img.name)}
                      className='hover:bg-destructive/20 absolute top-1 right-1 rounded-full bg-white/70 p-[2px]'
                    >
                      <X className='text-destructive h-3 w-3' />
                    </button>
                  </div>
                );
              })}
            </div>
          </CustomScrollbar>
        </div>
      ) : (
        <div className='mt-1'>
          <div className='grid grid-cols-3 gap-2'>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className='border-muted bg-muted/30 flex aspect-square h-[105px] w-full items-center justify-center rounded-[6px] border'
              >
                <ImageIcon className='text-muted-foreground h-5 w-5' />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
