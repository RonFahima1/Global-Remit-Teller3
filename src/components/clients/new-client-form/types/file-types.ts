export interface DocumentFile {
  file: File;
  name: string;
  size: number;
  type: string;
}

export type FileField = 'idDocument' | 'proofOfAddress';
