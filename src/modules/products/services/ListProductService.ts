import { inject, injectable } from 'tsyringe';
import { IProductsRepository } from '../domain/repositories/IProductsRepository';
import Product from '../infra/typeorm/entities/Product';

@injectable()
class ListProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute(): Promise<Product[]> {
    //vai retornar todos os products e armazenar na variavel
    const products = this.productsRepository.findAll();
    return products;
  }
}

export default ListProductService;
