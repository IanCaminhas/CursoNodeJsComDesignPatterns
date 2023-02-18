import AppError from '@shared/infra/http/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { IUpdateProduct } from '../domain/models/IUpdateProduct';
import { IProductsRepository } from '../domain/repositories/IProductsRepository';
import Product from '../infra/typeorm/entities/Product';

@injectable()
class UpdateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({
    id,
    name,
    price,
    quantity,
  }: IUpdateProduct): Promise<Product> {
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new AppError('Product not found. ');
    }

    const productExists = await this.productsRepository.findByName(name);

    //Estou verificando se o novo nome já existe
    //O name que quero atualizar é diferente do name que já existe atualmente
    if (productExists && name != product.name) {
      throw new AppError('There is already one product with this name');
    }

    //Depois de realizar as duas verificacoes, poderei atualizar o product
    product.name = name;
    product.price = price;
    product.quantity = quantity;

    await this.productsRepository.save(product);

    return product;
  }
}

export default UpdateProductService;
