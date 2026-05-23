import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export const getTempDir = () => {
  const tempDir = path.join(__dirname, '../../temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  return tempDir;
};

export const generateTempFilePath = (extension: string) => {
  return path.join(getTempDir(), `${crypto.randomUUID()}.${extension}`);
};

export const cleanupFiles = (files: string[]) => {
  files.forEach(file => {
    if (fs.existsSync(file)) {
      try {
        fs.unlinkSync(file);
      } catch (err) {
        console.error(`Failed to delete file ${file}:`, err);
      }
    }
  });
};
