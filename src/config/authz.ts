import { expressjwt as jwt } from 'express-jwt';
import * as jwksRsa from 'jwks-rsa';
import config from './config';

export const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${config.get('AUTH0_DOMAIN')}/.well-known/jwks.json`,
  }) as any,

  audience: config.get('AUTH0_AUDIENCE'),
  issuer: `https://${config.get('AUTH0_DOMAIN')}/`,
  algorithms: ['RS256'],
});
