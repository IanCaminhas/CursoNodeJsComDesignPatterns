import AppError from '@shared/http/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Product from '../typeorm/entities/Product';
import { ProductRepository } from '../typeorm/repositories/ProductsRepository';

interface IRequest {
  id: string;
}

class ShowProductService {
  public async execute({ id }: IRequest): Promise<Product> {
    const productsRepository = getCustomRepository(ProductRepository);
    //vai retornar um unico produto
    const product = await productsRepository.findOne(id);
    //Tratamento caso nao encontrar nada
    if (!product) {
      throw new AppError('Product not found. ');
    }
    return product;
  }
}

export default ShowProductService;
