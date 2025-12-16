import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import CustomScrollbar from './custom-scrollbar';
import { cn } from '@/lib/utils';

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = bytes / Math.pow(k, i);
  return `${parseFloat(size.toFixed(1))} ${units[i]}`;
}

type ExistingFile = {
  file_name: string;
  file_url: string;
};

type FileUploadProps = {
  value?: File[];
  onChange?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  className?: string;
  maxHeight?: number;
  existingFiles?: ExistingFile[];
  onRemoveExisting?: (file: ExistingFile) => void;
  maxFiles?: number;
  disabled?: boolean;
};

export function FileUpload({
  value,
  onChange,
  accept = '.jpg,.png,.pdf,.doc,.docx',
  multiple = true,
  className = '',
  maxHeight,
  existingFiles,
  onRemoveExisting,
  maxFiles,
  disabled = false
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);

  const totalFiles = files.length + (existingFiles?.length ?? 0);

  const isMaxReached = maxFiles !== undefined && totalFiles >= maxFiles;

  const isUploadDisabled = disabled || isMaxReached;

  useEffect(() => {
    if (value) {
      setFiles(value ?? []);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);

    const remaining = (maxFiles ?? Infinity) - totalFiles;

    if (remaining <= 0) return;

    const allowedFiles = selectedFiles.slice(0, remaining);

    const nextFiles = multiple ? [...files, ...allowedFiles] : allowedFiles;

    setFiles(nextFiles);
    onChange?.(nextFiles);

    e.target.value = '';
  };

  const handleRemove = (name: string) => {
    const nextFiles = files.filter((f) => f.name !== name);
    setFiles(nextFiles);
    onChange?.(nextFiles);
  };

  return (
    // <div className={`flex flex-col gap-1 ${className}`}>
    //   <div className='flex flex-col items-center gap-2'>
    //     <input
    //       id='file-upload'
    //       type='file'
    //       multiple={multiple}
    //       accept={accept}
    //       className='hidden'
    //       onChange={handleChange}
    //     />

    //     <label
    //       htmlFor='file-upload'
    //       className='flex !min-h-[59px] w-full cursor-pointer items-center rounded-[4px] border-1 border-dashed px-1.5 py-1.5 transition-colors'
    //     >
    //       {files.length === 0 || existingFiles?.length === 0 && (
    //         <div className='flex w-full flex-col items-center gap-1'>
    //           <Upload
    //             width={12}
    //             height={12}
    //             className='text-muted-foreground'
    //           />
    //           <span className='text-muted-foreground text-xs'>
    //             Nhấp để chọn file
    //           </span>
    //         </div>
    //       )}

    //       {(existingFiles?.length || files.length > 0) && (
    //         <CustomScrollbar
    //           className="overflow-y-auto"
    //           style={{ maxHeight: maxHeight ? `${maxHeight}px` : undefined }}
    //         >
    //           <div className="grid grid-cols-2 gap-2">
    //             {existingFiles?.map((file) => (
    //               <div
    //                 key={file.file_url}
    //                 className="bg-muted flex h-[43px] w-[150px] items-center gap-2 rounded-[6px] px-2 py-2"
    //               >
    //                 <a
    //                   href={file.file_url}
    //                   target="_blank"
    //                   rel="noopener noreferrer"
    //                   className="flex min-w-0 flex-1 gap-2"
    //                 >
    //                   <Image
    //                     src="/assets/icons/fileText.svg"
    //                     alt="file"
    //                     width={12}
    //                     height={12}
    //                   />
    //                   <span className="truncate text-xs text-foreground">
    //                     {file.file_name}
    //                   </span>
    //                 </a>

    //                 <button
    //                   type="button"
    //                   onClick={(e) => {
    //                     e.preventDefault();
    //                     onRemoveExisting?.(file);
    //                   }}
    //                   className="rounded p-0.5 hover:bg-destructive/10"
    //                 >
    //                   <X className="h-3.5 w-3.5 text-destructive" />
    //                 </button>
    //               </div>
    //             ))}

    //             {files.map((file) => (
    //               <div
    //                 key={file.name}
    //                 className="bg-muted flex h-[43px] w-[150px] items-center gap-2 rounded-[6px] px-2 py-2"
    //               >
    //                 <div className="flex w-full min-w-0 flex-1 gap-2">
    //                   <Image
    //                     src="/assets/icons/fileText.svg"
    //                     alt="file"
    //                     width={12}
    //                     height={12}
    //                   />
    //                   <div className="flex flex-col min-w-0">
    //                     <span className="truncate text-xs text-foreground">
    //                       {file.name}
    //                     </span>
    //                     <span className="text-xs">{formatFileSize(file.size)}</span>
    //                   </div>
    //                 </div>

    //                 <button
    //                   type="button"
    //                   onClick={(e) => {
    //                     e.preventDefault();
    //                     handleRemove(file.name);
    //                   }}
    //                   className="rounded p-0.5 hover:bg-destructive/10"
    //                 >
    //                   <X className="h-3.5 w-3.5 text-destructive" />
    //                 </button>
    //               </div>
    //             ))}
    //           </div>
    //         </CustomScrollbar>
    //       )}

    //     </label>
    //   </div>
    // </div>

    <div className={`flex flex-col gap-1 ${className}`}>
      <input
        id='file-upload'
        type='file'
        multiple={multiple}
        accept={accept}
        className='hidden'
        onChange={handleChange}
        disabled={isUploadDisabled}
      />

      {/* ✅ UPLOAD AREA */}
      <label
        htmlFor={isUploadDisabled ? undefined : 'file-upload'}
        className={cn(
          'flex min-h-[59px] w-full items-center justify-center rounded-[4px] border border-dashed px-1.5 py-1.5 transition-colors',
          isUploadDisabled ? 'hidden' : 'hover:bg-accent cursor-pointer'
        )}
      >
        {files.length === 0 && (existingFiles?.length ?? 0) === 0 && (
          <div className='flex flex-col items-center gap-1'>
            <Upload width={12} height={12} className='text-muted-foreground' />
            <span className='text-muted-foreground text-xs'>
              Nhấp để chọn file
            </span>
          </div>
        )}

        {(files.length > 0 || (existingFiles?.length ?? 0) > 0) && (
          <span className='text-muted-foreground text-xs'>Thêm file khác</span>
        )}
      </label>

      {/* ✅ FILE LIST + SCROLLBAR */}
      {(existingFiles?.length || files.length > 0) && (
        <CustomScrollbar
          className='overflow-y-auto'
          style={{ maxHeight: maxHeight ? `${maxHeight}px` : 120 }}
        >
          <div className='grid gap-2 p-1 md:grid-cols-2'>
            {existingFiles?.map((file) => (
              <div
                key={file.file_url}
                className='bg-muted flex h-[43px] w-full items-center gap-2 rounded-[6px] px-2 py-2'
              >
                <a
                  href={file.file_url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex min-w-0 flex-1 gap-2'
                >
                  <Image
                    src={getFileIcon(file.file_name)}
                    alt='file'
                    width={12}
                    height={12}
                  />
                  <span className='text-foreground truncate text-xs'>
                    {file.file_name}
                  </span>
                </a>

                <button
                  type='button'
                  disabled={disabled}
                  onClick={() => onRemoveExisting?.(file)}
                  className={cn(
                    'rounded p-0.5',
                    disabled
                      ? 'cursor-not-allowed opacity-40'
                      : 'hover:bg-destructive/10'
                  )}
                >
                  <X className='text-destructive h-3.5 w-3.5' />
                </button>
              </div>
            ))}

            {files.map((file) => (
              <div
                key={file.name}
                className='bg-muted flex h-[43px] w-full items-center gap-2 rounded-[6px] px-2 py-2'
              >
                <div className='flex min-w-0 flex-1 gap-2'>
                  <Image
                    src={getFileIcon(file.name)}
                    alt='file'
                    width={12}
                    height={12}
                  />
                  <div className='flex min-w-0 flex-col'>
                    <span className='text-foreground truncate text-xs'>
                      {file.name}
                    </span>
                    <span className='text-xs'>{formatFileSize(file.size)}</span>
                  </div>
                </div>

                <button
                  type='button'
                  disabled={disabled}
                  onClick={() => handleRemove(file.name)}
                  className={cn(
                    'rounded p-0.5',
                    disabled
                      ? 'cursor-not-allowed opacity-40'
                      : 'hover:bg-destructive/10'
                  )}
                >
                  <X className='text-destructive h-3.5 w-3.5' />
                </button>
              </div>
            ))}
          </div>
        </CustomScrollbar>
      )}
      {(existingFiles?.length ?? 0) === 0 &&
        files.length === 0 &&
        disabled && ( // disabled = true nghĩa là view
          <div className='text-muted-foreground mt-1 text-xs italic'>
            Không có tập tin đính kèm
          </div>
        )}
    </div>
  );
}

const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();

  switch (ext) {
    case 'pdf':
      return '/assets/icons/pdf.svg';
    case 'doc':
      return '/assets/icons/word.svg';
    case 'docx':
      return '/assets/icons/word.svg';
    case 'xls':
      return '/assets/icons/excel.svg';
    case 'xlsx':
      return '/assets/icons/excel.svg';
    case 'jpg':
      return '/assets/icons/png.svg';
    case 'jpeg':
      return '/assets/icons/png.svg';
    case 'png':
      return '/assets/icons/png.svg';
    default:
      return '/assets/icons/fileTextIcon.svg';
  }
};

//Keep another style

{
  /* <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex flex-col gap-1">
        <label
          htmlFor="file-upload"
          className="flex items-center cursor-pointer px-3 py-1.5 rounded-[4px] w-fit border transition-colors hover:bg-accent"
        >
          <Upload className="w-3 h-3 mr-2" />
          <span className="text-xs">Chọn tệp</span>
        </label>

        <input
          id="file-upload"
          type="file"
          multiple
          accept=".jpg,.png,.pdf,.doc,.docx"
          onChange={handleChange}
          className="hidden"
        />

        {files.length > 0 && (
          <div className={`mt-1 border border-dashed p-1 overflow-hidden`}
            style={{ maxHeight: maxHeight ? `${maxHeight}px` : undefined }}
          >
            <CustomScrollbar className={`overflow-y-auto`}
              style={{ maxHeight: maxHeight ? `${maxHeight}px` : undefined}}
            >
              <div className="flex flex-wrap gap-2">
                {files.map((file) => (
                  <div
                    key={file.name}
                    className="w-[178px] h-[43px] flex items-center gap-2 px-2 py-2 rounded-[6px] bg-muted"
                  >
                    <div className="flex gap-2 flex-1 w-full min-w-0">
                      <Image
                        src="/assets/icons/fileText.svg"
                        alt="fileText"
                        width={12}
                        height={12}
                      />
                      <div className="flex flex-col w-full">
                        <span className="truncate text-xs text-foreground max-w-[80%]">
                          {file.name}
                        </span>
                        <span className="text-xs">{formatFileSize(file.size)}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemove(file.name);
                      }}
                      className="p-0.5 hover:bg-destructive/10 rounded"
                    >
                      <X className="w-3.5 h-3.5 text-destructive" />
                    </button>
                  </div>
                ))}
              </div>
            </CustomScrollbar>
          </div>
        )}
      </div>
    </div> */
}
