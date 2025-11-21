'use client';
import { Button } from '@/ui/components/ui/button';
import { memo, useMemo, useState } from 'react';
import BranchDialog from './modal/tag-dialog';
import { IconPlus } from '@tabler/icons-react';
import Image from 'next/image';
import { useGetTags } from '@/core/domains/tags';

export type SelectedTag = {
  id: string;
  alias: string;
  name: string;
} | null;

interface TagSidebarProps {
  onTagChange: (tag: SelectedTag) => void;
}

export const TagSidebar = memo(function TagSidebar({
  onTagChange
}: TagSidebarProps) {
  const [openNew, setOpenNew] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredTags = useMemo(() => {
    if (!data?.tag) return [];
    const term = searchTerm.toLowerCase().trim();
    if (!term) return data.tag;
    return data.tag.filter(
      (tag: any) =>
        tag.name.toLowerCase().includes(term) ||
        tag.alias.toLowerCase().includes(term)
    );
  }, [data?.tag, searchTerm]);

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
          filteredTags.map((tag) => {
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
                className={`hover:bg-primary/5 mb-1 flex w-full cursor-pointer gap-2 rounded px-2 py-1 text-xs ${active ? 'bg-tree-select text-primary' : ''}`}
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
        pageTitle='Thêm nhóm yêu thích'
        open={openNew}
        onOpenChange={setOpenNew}
        roleId={null}
      />
    </div>
  );
});
