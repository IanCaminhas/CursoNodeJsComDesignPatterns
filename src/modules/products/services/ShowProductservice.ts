import AppError from '@shared/infra/http/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { IShowProduct } from '../domain/models/IShowProduct';
import { IProductsRepository } from '../domain/repositories/IProductsRepository';
import Product from '../infra/typeorm/entities/Product';

@injectable()
class ShowProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({ id }: IShowProduct): Promise<Product> {
    //vai retornar um unico produto
    const product = await this.productsRepository.findById(id);
    //Tratamento caso nao encontrar nada
    if (!product) {
      throw new AppError('Product not found. ');
    }
    return product;
  }
}

export default ShowProductService;
