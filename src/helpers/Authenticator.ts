import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { authenticationData } from '../users/entities/user.entity';

export class Authenticator {
  generateToken = (payload: authenticationData) => {
    const token = sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: '24h',
    });

    return token;
  };

  getTokenData = (token: string) => {
    try {
      const tokenData = verify(
        token,
        process.env.JWT_SECRET as string,
      ) as JwtPayload;

      return {
        id: tokenData.id,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}
