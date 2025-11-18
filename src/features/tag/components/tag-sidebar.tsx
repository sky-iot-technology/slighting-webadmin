'use client';
import { SelectedRegion } from '@/ui/components/tree-group';
import { Button } from '@/ui/components/ui/button';
import { memo, useState } from 'react';
import BranchDialog from './modal/branch-dialog';
import { IconPlus } from '@tabler/icons-react';
import Image from 'next/image';
import { useGetTags } from '@/core/domains/tags';

export type SelectedTag = {
  id: string;
  alias: string;
  name: string;
} | null;

interface TagSidebarProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  onTagChange: (tag: SelectedTag) => void;
}

export const TagSidebar = memo(function TagSidebar({
  searchTerm,
  setSearchTerm,
  onTagChange
}: TagSidebarProps) {
  const [openNew, setOpenNew] = useState(false);

  const [selectedTag, setSelectedTag] = useState<SelectedTag>(null);

  const { data, isLoading } = useGetTags({
    resource_type: 'device'
  });

  const handleSelectTag = (tag: {
    id: string;
    alias: string;
    name: string;
  }) => {
    const isSame = selectedTag?.id === tag.id;
    const updated = isSame ? null : tag;

    setSelectedTag(updated);
    onTagChange(updated);
  };

  return (
    <div className={`flex h-full flex-col pt-[9px] pr-[10px] pl-2`}>
      <div
        className={`mb-2 flex h-[31px] items-center justify-end rounded-[6px] px-1`}
      >
        <Button
          className='h-8 w-[110px] gap-1 text-xs'
          onClick={() => setOpenNew(!openNew)}
        >
          <IconPlus className='h-3 w-3' />
          Thêm nhóm
        </Button>
      </div>
      <div className='bg-background mb-2 flex h-[31px] items-center rounded-[6px] px-2'>
        <Image
          src={'/assets/icons/search.svg'}
          alt='search'
          width={11}
          height={11}
          className='text-muted-foreground mr-2 ml-1.5'
        />
        <input
          className='text-foreground placeholder:text-muted-foreground w-full flex-1 bg-transparent text-xs focus:outline-none'
          placeholder='Tìm kiếm nhóm'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div>
        {!isLoading &&
          (data?.total ?? 0) > 0 &&
          data?.tag?.map((tag) => {
            const active = selectedTag?.id === tag.id;
            return (
              <button
                key={tag.id}
                onClick={() =>
                  handleSelectTag({
                    id: String(tag.id),
                    alias: tag.alias,
                    name: tag.name
                  })
                }
                className={`hover:bg-primary/5 flex w-full cursor-pointer gap-2 rounded px-2 py-1 text-xs ${active ? 'bg-tree-select text-primary' : ''}`}
              >
                <Image
                  src={'/assets/icons/heart.svg'}
                  alt='heart'
                  width={11}
                  height={11}
                  className=''
                />
                {tag.name}
              </button>
            );
          })}
      </div>

      <BranchDialog
        pageTitle='Thêm chi nhánh'
        open={openNew}
        onOpenChange={setOpenNew}
        groupId={null}
      />
    </div>
  );
});
