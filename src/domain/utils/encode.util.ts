export class EncodeUtil {
  static encodeBase64(data: string): string {
    return Buffer.from(data).toString('base64');
  }

  static decodeBase64(data: string): string {
    return Buffer.from(data, 'base64').toString();
  }
}
