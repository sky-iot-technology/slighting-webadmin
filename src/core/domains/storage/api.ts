import { authenticatedApi } from '@/core/shared/api';

export const storageApi = {
  async deletefile(url: string): Promise<void> {
    try {
      const path = extractPath(url);
      return await authenticatedApi.delete<void>(`/d/delete/${path}`);
    } catch (error) {
      throw new Error('Failed to delete avatar user');
    }
  },
  async upload(
    file: File
  ): Promise<{ url: string; path: string; name: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await authenticatedApi.post<{
        url: string;
        path: string;
        name: string;
      }>('/d/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      return response;
    } catch (error) {
      throw new Error('Failed to upload avatar user');
    }
  },
  async uploadToDomain(
    domainId: string,
    file: File
  ): Promise<{
    url: string;
    path: string;
    name: string;
    md5: string;
    size: number;
  }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await authenticatedApi.post<{
        url: string;
        path: string;
        name: string;
        md5: string;
        size: number;
      }>(`/d/upload?domain=${domainId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      return response;
    } catch (error) {
      throw new Error('Failed to upload avatar user');
    }
  },
  async uploadAttachments(
    domainId: string,
    files: File[]
  ): Promise<{ url: string; path: string; name: string }[]> {
    try {
      const result = await Promise.allSettled(
        files.map(async (file) => {
          const res = this.uploadToDomain(domainId, file);
          return res;
        })
      );

      return result
        .filter(
          (
            r
          ): r is PromiseFulfilledResult<{
            url: string;
            path: string;
            name: string;
            md5: string;
            size: number;
          }> => r.status === 'fulfilled'
        )
        .map((r) => ({
          name: r.value.name,
          url: r.value.url,
          path: r.value.path
        }));
    } catch (error) {
      throw new Error('Failed to upload attachments');
    }
  },
  async deleteAttachments(
    urls: string[]
  ): Promise<{ path: string; success: boolean }[]> {
    try {
      const results = await Promise.allSettled(
        urls.map(async (url) => {
          await this.deletefile(url);
          return { url, success: true };
        })
      );

      return results.map((r, i) => ({
        path: urls[i],
        success: r.status === 'fulfilled'
      }));
    } catch (error) {
      throw new Error('Failed to delete attachments');
    }
  }
};

function extractPath(url: string): string {
  const parts = url.split('/uploads/');
  return parts[1] ? `/uploads/${parts[1]}` : '';
}
