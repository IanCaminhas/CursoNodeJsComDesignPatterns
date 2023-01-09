import { Request, Response, NextFunction } from 'express';
//vai armazenar os endereços IP's e qtd de requisições feitas.
import Redis from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import AppError from '@shared/infra/http/errors/AppError';

//é um middleware
export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const redisClient = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASS || undefined,
    });

    const limiter = new RateLimiterRedis({
      storeClient: redisClient,
      keyPrefix: 'ratelimit',
      points: 1, //numero de requisições por IP/segundo. Cada endereço IP pode fazer no máximo 5 requisições/segundo
      duration: 1, //1 segundo de: 5 requisições a cada segundo
    });

    await limiter.consume(request.ip);
    return next();
  } catch (err) {
    throw new AppError('Too many requests.', 429);
  }
}
