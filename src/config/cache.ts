//arquivo de configuração de conexão com o redis
//estou exportando um objeto de configuração do redis

import { RedisOptions } from 'ioredis';

interface ICacheConfig {
  config: {
    redis: RedisOptions;
  };
  driver: string;
}

export default {
  /*configurando tudo que o redis precisa para poder
se conectar ao banco de dados no container(redis) */
  config: {
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASS || undefined,
    },
  },
  driver: 'redis',
} as ICacheConfig;
