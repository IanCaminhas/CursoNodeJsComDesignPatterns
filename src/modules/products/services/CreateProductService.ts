import AppError from '@shared/infra/http/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { ICreateProduct } from '../domain/models/ICreateProduct';
import { IProductsRepository } from '../domain/repositories/IProductsRepository';

@injectable()
class CreateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  //todo service deve ter uma responsabilidade
  //Todo service precisa atender as regras de negocio da aplicação. No caso cadastrar um produto que ja existe
  //recebe o produto a ser cadastrado
  public async execute({ name, price, quantity }: ICreateProduct) {
    //preciso fazer uma verificacao, pois nao posso criar produtos com nomes iguais.
    const productExists = await this.productsRepository.findByName(name);
    if (productExists) {
      throw new AppError('There is already one product with this name');
    }
    //se nao tiver um produto com o mesmo nome, criar o produto e salvar no bd
    const product = await this.productsRepository.create({
      name,
      price,
      quantity,
    });

    await this.productsRepository.save(product);
    return product;
  }
}

export default CreateProductService;
