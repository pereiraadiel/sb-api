import * as QRCode from 'qrcode';
import * as fs from 'fs';
import * as path from 'path';
import { QrcodeService } from '@/domain/services/qrcode.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConcreteQrcodeService implements QrcodeService {
  private readonly path = path.resolve(
    __dirname,
    '..',
    '..',
    'assets',
    'qr.png',
  );

  async generateCode(payload: string) {
    await QRCode.toFile(this.path, payload);
    return this;
  }

  get stream() {
    return fs.createReadStream(this.path);
  }
}
