import AppError from '@shared/infra/http/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { IDeleteProduct } from '../domain/models/IDeleteProduct';
import { IProductsRepository } from '../domain/repositories/IProductsRepository';

@injectable()
class DeleteProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({ id }: IDeleteProduct): Promise<void> {
    //vai retornar um unico produto
    const product = await this.productsRepository.findById(id);
    //Tratamento caso nao encontrar nada
    if (!product) {
      throw new AppError('Product not found. ');
    }

    await this.productsRepository.remove(product);
  }
}

export default DeleteProductService;
