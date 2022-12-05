import { getCustomRepository } from 'typeorm';
import Product from '../typeorm/entities/Product';
import { ProductRepository } from '../typeorm/repositories/ProductsRepository';

class ListProductService {
  public async execute(): Promise<Product[]> {
    const productsRepository = getCustomRepository(ProductRepository);

    //vai retornar todos os products e armazenar na variavel
    const products = productsRepository.find();
    return products;
  }
}

export default ListProductService;
