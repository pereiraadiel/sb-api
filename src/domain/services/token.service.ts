export interface TokenService {
  generateToken(payload: { [key: string]: string }): string;
}
