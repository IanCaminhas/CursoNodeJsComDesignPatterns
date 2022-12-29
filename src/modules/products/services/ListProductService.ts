import { getCustomRepository } from 'typeorm';
import Product from '../typeorm/entities/Product';
import { ProductRepository } from '../typeorm/repositories/ProductsRepository';
import RedisCache from '@shared/cache/RedisCache';

class ListProductService {
  public async execute(): Promise<Product[]> {
    const productsRepository = getCustomRepository(ProductRepository);

    const redisCache = new RedisCache();

    //Passando como tipo no recover: é uma lista de produtos: Product[]
    //vai no cache e tenta recuperar a informação que está armazenada na chave
    let products = await redisCache.recover<Product[]>(
      'api-vendas-PRODUCT_LIST', //essa é a key a ser buscada no servidor
    );

    /*
    Se não tiver retorno do cache...
    se a lista de produtos estiver no redis,
    a condição abaixo não é executada. No caso, já faço o return products
    Se a lista no redis estiver vazia, faço a chamada no
    banco de dados e salvo a nova lista no redis
    */
    if (!products) {
      products = await productsRepository.find();

      await redisCache.save('api-vendas-PRODUCT_LIST', products);
    }

    return products;
  }
}

export default ListProductService;
