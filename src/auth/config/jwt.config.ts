import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => {
  return {
    secret: process.env.JWT_SECRET,
    access_token_ttl: parseInt(process.env.JWT_ACCESS_TOKEN_TTL ?? '3600'),
    audience: process.env.JWT_AUDIENCE,
    issuer: process.env.JWT_ISSUER,
  };
});
