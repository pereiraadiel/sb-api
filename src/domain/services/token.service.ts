
export const TOKEN_SERVICE = 'TOKEN_SERVICE';
export interface TokenService {
  generateToken(payload: { [key: string]: string }): string;
  verifyToken(token: string): { [key: string]: string };
}
