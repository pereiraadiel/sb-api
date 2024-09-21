import { Readable } from 'stream';

export const QRCODE_SERVICE = 'QRCODE_SERVICE';

export interface QrcodeService {
  generateCode(payload: string): Promise<QrcodeService>;
  stream: Readable;
}
