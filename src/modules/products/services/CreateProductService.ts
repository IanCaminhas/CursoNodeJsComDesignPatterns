import AppError from '@shared/http/errors/AppError';
import { getCustomRepository } from 'typeorm';
import { ProductRepository } from '../typeorm/repositories/ProductsRepository';

interface IRequest {
  name: string;
  price: number;
  quantity: number;
}

class CreateProductService {
  //todo service deve ter uma responsabilidade
  //Todo service precisa atender as regras de negocio da aplicação. No caso cadastrar um produto que ja existe
  //recebe o produto a ser cadastrado
  public async execute({ name, price, quantity }: IRequest) {
    //Quando e um repositorio customizado, usamos o metodo getCustomRepository pertencente ao TypeORM
    const productsRepository = getCustomRepository(ProductRepository);

    //preciso fazer uma verificacao, pois nao posso criar produtos com nomes iguais.
    const productExists = await productsRepository.findByName(name);
    if (productExists) {
      throw new AppError('There is already one product with this name');
    }
    //se nao tiver um produto com o mesmo nome, criar o produto e salvar no bd
    const product = productsRepository.create({
      name,
      price,
      quantity,
    });

    await productsRepository.save(product);
    return product;
  }
}

export default CreateProductService;
