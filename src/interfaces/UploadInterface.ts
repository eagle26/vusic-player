import type { FStore } from '../Types';

export interface UploadInterface {
  task: FStore.UploadTask | null;
  progress: number;
  name: string;
  status: string;
  errorMsg?: string | null;
}
