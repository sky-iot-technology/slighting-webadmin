'use client';
import { Button } from '@/ui/components/ui/button';
import { memo, useEffect, useMemo, useState } from 'react';
import BranchDialog from './modal/tag-dialog';
import { IconPlus } from '@tabler/icons-react';
import Image from 'next/image';
import { useGetTags, useUpdateTag } from '@/core/domains/tags';
import { PermissionGuard } from '@/core/domains/permissions';
import { useTranslation } from '@/core/domains/language/useTranslation';

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
  const { t } = useTranslation();
  const [openNew, setOpenNew] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<SelectedTag>(null);

  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const { data, isLoading } = useGetTags({
    resource_type: 'device'
  });

  const updateTag = useUpdateTag();

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

  useEffect(() => {
    if (data?.tag?.length && !selectedTag) {
      const firstTag = data.tag[0];

      const defaultTag = {
        id: String(firstTag.id),
        alias: firstTag.alias,
        name: firstTag.name
      };

      setSelectedTag(defaultTag);
      onTagChange(defaultTag);
    }
  }, [data?.tag, selectedTag, onTagChange]);

  return (
    <div className={`flex h-full flex-col pt-[9px] pr-[10px] pl-2`}>
      <BranchDialog
        pageTitle={t('tag.add_favorite_group')}
        open={openNew}
        onOpenChange={setOpenNew}
        roleId={null}
      />
      <PermissionGuard module='tag' action='create' fallback={null}>
        <div
          className={`mb-2 flex h-[31px] items-center justify-end rounded-[6px] px-1`}
        >
          <Button
            className='h-8 w-[110px] gap-1 text-xs'
            onClick={() => setOpenNew(!openNew)}
          >
            <IconPlus className='h-3 w-3' />
            {t('tag.add_group')}
          </Button>
        </div>
      </PermissionGuard>
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
          placeholder={t('tag.search_group')}
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
                className={`group hover:bg-primary/5 mb-1 flex w-full cursor-pointer justify-between gap-2 rounded px-2 py-1 text-xs ${active ? 'bg-tree-select text-primary' : ''}`}
              >
                <span className='flex items-center gap-2'>
                  <Image
                    src={'/assets/icons/tag.svg'}
                    alt='tag'
                    width={11}
                    height={11}
                  />
                  {editingTagId === tag.id ? (
                    <input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                      className='border-primary w-auto max-w-[120px] border bg-transparent px-1 text-xs focus:outline-none'
                    />
                  ) : (
                    <>{tag.name}</>
                  )}
                </span>

                <span className='hidden items-baseline gap-3 group-hover:flex'>
                  {editingTagId === tag.id ? (
                    <>
                      {/* Confirm */}
                      <span
                        role='button'
                        className='cursor-pointer text-green-600 hover:text-green-700'
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingTagId(null);
                          updateTag.mutate({
                            tagId: String(tag.id),
                            name: editValue
                          });
                        }}
                      >
                        ✔
                      </span>

                      <span
                        role='button'
                        className='cursor-pointer text-red-600 hover:text-red-700'
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingTagId(null);
                        }}
                      >
                        ✖
                      </span>
                    </>
                  ) : (
                    <>
                      <PermissionGuard
                        module='tag'
                        action='update'
                        fallback={null}
                      >
                        <span
                          role='button'
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingTagId(String(tag.id));
                            setEditValue(tag.name);
                          }}
                        >
                          <Image
                            src={'/assets/icons/edit.svg'}
                            alt='edit'
                            width={12}
                            height={12}
                          />
                        </span>
                      </PermissionGuard>

                      {/* <span
                        role="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          // onDeleteTag(tag.id);
                          console.log('delete');
                        }}
                      >
                        <Image
                          src={'/assets/icons/trash.svg'}
                          alt='trash'
                          width={12}
                          height={12}
                        />
                      </span> */}
                    </>
                  )}
                </span>
              </button>
            );
          })}
      </div>
    </div>
  );
});
