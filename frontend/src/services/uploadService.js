import apiClient from './apiClient';
import { ENDPOINTS } from './endpointUrls';

export const uploadService = {
  /**
   * Uploads a single file to the backend
   * @param {File} file - Browser File object from input
   * @param {'receipts' | 'thumbnails' | 'avatars' | 'resources' | 'general'} folder
   * @returns {Promise<{ url: string, fullUrl: string, filename: string }>}
   */
  async uploadFile(file, folder = 'general') {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post(
      `${ENDPOINTS.UPLOADS}?folder=${encodeURIComponent(folder)}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data?.data || response.data;
  },
};

export default uploadService;
