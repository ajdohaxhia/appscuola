'use client';

interface UploadResponse {
  url: string;
  type: string;
  size: number;
}

export class FileUploadService {
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  private static readonly ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

  /**
   * Validate file before upload
   */
  private validateFile(file: File): void {
    if (file.size > FileUploadService.MAX_FILE_SIZE) {
      throw new Error(`File size exceeds limit of ${FileUploadService.MAX_FILE_SIZE / 1024 / 1024}MB`);
    }

    const isImage = FileUploadService.ALLOWED_IMAGE_TYPES.includes(file.type);
    const isDocument = FileUploadService.ALLOWED_DOCUMENT_TYPES.includes(file.type);

    if (!isImage && !isDocument) {
      throw new Error('File type not supported');
    }
  }

  /**
   * Convert file to base64
   */
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  /**
   * Upload file to server
   */
  async uploadFile(file: File): Promise<UploadResponse> {
    try {
      // Validate file
      this.validateFile(file);

      // Convert to base64
      const base64Data = await this.fileToBase64(file);

      // Send to server
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file: base64Data,
          type: file.type,
          name: file.name,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to upload file');
      }

      const data = await response.json();
      return {
        url: data.url,
        type: file.type,
        size: file.size,
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  /**
   * Upload multiple files
   */
  async uploadFiles(files: File[]): Promise<UploadResponse[]> {
    const uploadPromises = files.map(file => this.uploadFile(file));
    return Promise.all(uploadPromises);
  }

  /**
   * Get file type category
   */
  getFileCategory(type: string): 'image' | 'document' | 'other' {
    if (FileUploadService.ALLOWED_IMAGE_TYPES.includes(type)) {
      return 'image';
    }
    if (FileUploadService.ALLOWED_DOCUMENT_TYPES.includes(type)) {
      return 'document';
    }
    return 'other';
  }
} 