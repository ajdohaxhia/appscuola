'use client';

import { dbService } from './db';

// Tipo per le immagini
export interface UserImage {
  id: number;
  filename: string;
  url: string;
  thumbnailUrl: string;
  mimeType: string;
  size: number;
  width: number;
  height: number;
  title?: string;
  description?: string;
  tags?: string[];
  uploadDate: Date;
  userId?: string;
}

// Classe per gestire le immagini
export class ImageService {
  // Carica un'immagine
  async uploadImage(file: File, options: {
    title?: string;
    description?: string;
    tags?: string[];
    userId?: string;
  } = {}): Promise<UserImage> {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          // Simula l'upload dell'immagine (in una app reale qui ci sarebbe l'upload a un servizio)
          const url = reader.result as string;
          
          // Crea una thumbnail
          const thumbnailUrl = await this.createThumbnail(url);
          
          // Crea un'immagine temporanea per ottenere dimensioni
          const img = new Image();
          img.onload = async () => {
            const { title, description, tags, userId } = options;
            
            // Crea il record dell'immagine
            const image: Omit<UserImage, 'id'> = {
              filename: file.name,
              url,
              thumbnailUrl,
              mimeType: file.type,
              size: file.size,
              width: img.width,
              height: img.height,
              title,
              description,
              tags,
              uploadDate: new Date(),
              userId
            };
            
            // Salva nel database
            const id = await dbService.createImage(image);
            resolve({ ...image, id });
          };
          
          img.onerror = () => {
            reject(new Error('Errore nel caricamento dell\'immagine'));
          };
          
          img.src = url;
        };
        
        reader.onerror = () => {
          reject(new Error('Errore nella lettura del file'));
        };
        
        reader.readAsDataURL(file);
      } catch (error) {
        reject(error);
      }
    });
  }
  
  // Crea una thumbnail dell'immagine
  private async createThumbnail(dataUrl: string, maxSize: number = 200): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Ridimensiona mantenendo le proporzioni
        if (width > height) {
          if (width > maxSize) {
            height = Math.round(height * (maxSize / width));
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round(width * (maxSize / height));
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Impossibile creare il contesto del canvas'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Converti in dataURL
        const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(thumbnailUrl);
      };
      
      img.onerror = () => {
        reject(new Error('Errore nella creazione della thumbnail'));
      };
      
      img.src = dataUrl;
    });
  }
  
  // Ottieni immagini dell'utente
  async getUserImages(userId?: string): Promise<UserImage[]> {
    return await dbService.getUserImages(userId);
  }
  
  // Elimina un'immagine
  async deleteImage(imageId: number): Promise<boolean> {
    return await dbService.deleteImage(imageId);
  }
  
  // Aggiorna i metadati di un'immagine
  async updateImageMetadata(imageId: number, metadata: {
    title?: string;
    description?: string;
    tags?: string[];
  }): Promise<boolean> {
    return await dbService.updateImageMetadata(imageId, metadata);
  }
}

export const imageService = new ImageService(); 