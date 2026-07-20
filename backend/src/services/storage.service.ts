import fs from 'fs';
import path from 'path';

export interface StorageProvider {
  upload(filePath: string, destination: string): Promise<string>;
  delete(filePath: string): Promise<void>;
  getUrl(filePath: string): string;
  exists(filePath: string): boolean;
}

export class LocalStorageProvider implements StorageProvider {
  private baseDir: string;
  private baseUrl: string;

  constructor() {
    this.baseDir = path.join(__dirname, '..', '..', 'uploads');
    this.baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;

    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  async upload(sourcePath: string, destination: string): Promise<string> {
    const destPath = path.join(this.baseDir, destination);
    const destDir = path.dirname(destPath);

    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    fs.copyFileSync(sourcePath, destPath);
    return destination;
  }

  async delete(filePath: string): Promise<void> {
    const fullPath = path.join(this.baseDir, filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }

  getUrl(filePath: string): string {
    if (!filePath) return '';
    return `${this.baseUrl}/uploads/${filePath.replace(/\\/g, '/')}`;
  }

  exists(filePath: string): boolean {
    const fullPath = path.join(this.baseDir, filePath);
    return fs.existsSync(fullPath);
  }

  getAbsolutePath(filePath: string): string {
    return path.join(this.baseDir, filePath);
  }
}

// Singleton — swap this class for S3StorageProvider or CloudinaryStorageProvider later
export const storageProvider = new LocalStorageProvider();
