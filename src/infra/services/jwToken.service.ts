import { TokenService } from "@/domain/services/token.service";
import * as jwt from 'jsonwebtoken';

export class JwTokenService implements TokenService {
	generateToken(payload: { [key: string]: string; }): string {
		return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
	}

	verifyToken(token: string): { [key: string]: string; } {
		return jwt.verify(token, process.env.JWT_SECRET) as { [key: string]: string; };
	}

}