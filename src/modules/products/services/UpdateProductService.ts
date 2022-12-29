import RedisCache from '@shared/cache/RedisCache';
import AppError from '@shared/http/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Product from '../typeorm/entities/Product';
import { ProductRepository } from '../typeorm/repositories/ProductsRepository';

interface IRequest {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

class UpdateProductService {
  public async execute({
    id,
    name,
    price,
    quantity,
  }: IRequest): Promise<Product> {
    const productsRepository = getCustomRepository(ProductRepository);

    const product = await productsRepository.findOne(id);

    if (!product) {
      throw new AppError('Product not found. ');
    }

    const productExists = await productsRepository.findByName(name);

    //Estou verificando se o novo nome já existe
    //O name que quero atualizar é diferente do name que já existe atualmente
    if (productExists && name != product.name) {
      throw new AppError('There is already one product with this name');
    }

    const redisCache = new RedisCache();

    /*antes de atualizar o produto, invalide a chave. Afinal, com essa inclusão
    a lista será atualizada */
    await redisCache.invalidate('api-vendas-PRODUCT_LIST');

    //Depois de realizar as duas verificacoes, poderei atualizar o product
    product.name = name;
    product.price = price;
    product.quantity = quantity;

    await productsRepository.save(product);

    return product;
  }
}

export default UpdateProductService;
