//Classe de configuração de cache

import Redis, { Redis as RedisClient } from 'ioredis';
import cacheConfig from '@config/cache';

export default class RedisCache {
  private client: RedisClient;

  constructor() {
    this.client = new Redis(cacheConfig.config.redis);
  }

  //method para salvar o conteudo a ser cacheado.
  public async save(key: string, value: any): Promise<void>{
    console.log(key, value);
  }

  //metodo para recuperar a informação. É como se fosse o get
  //como o retorno é genérico.,vou usar o generic em typescript
  //O redis pode armazenar qualquer tipo de informação, por isso tipo generico.
  //A Promise é do mesmo tipo que a busca  recover<T>. Qualquer tipo. É do tipo genérico.
  //Para cada situação, é um tipo diferente
  public async recover<T>(key: string): Promise<T | null> {}

  //metodo para excluir o cache.
  public async invalidate(key: string): Promise<void>{}
}
