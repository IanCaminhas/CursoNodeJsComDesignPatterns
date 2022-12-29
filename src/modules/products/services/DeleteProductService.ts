import RedisCache from '@shared/cache/RedisCache';
import AppError from '@shared/http/errors/AppError';
import { getCustomRepository } from 'typeorm';
import { ProductRepository } from '../typeorm/repositories/ProductsRepository';

interface IRequest {
  id: string;
}

class DeleteProductService {
  public async execute({ id }: IRequest): Promise<void> {
    const productsRepository = getCustomRepository(ProductRepository);
    //vai retornar um unico produto
    const product = await productsRepository.findOne(id);
    //Tratamento caso nao encontrar nada
    if (!product) {
      throw new AppError('Product not found.');
    }

    const redisCache = new RedisCache();

    /*antes de deletar o produto, invalide a chave. Afinal, com essa inclusão
    a lista será atualizada */
    await redisCache.invalidate('api-vendas-PRODUCT_LIST');

    await productsRepository.remove(product);
  }
}

export default DeleteProductService;
