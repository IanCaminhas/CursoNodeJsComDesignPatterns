import { EntityRepository, Repository } from 'typeorm';
import Product from '../entities/Product';

//Esse repositorioe customizado
@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  //todo meotodo async deve retornar uma Promise
  //Promise<Product | undefined> -> a Promise vai retornar um Product ou undefined
  public async findByName(name: string): Promise<Product | undefined> {
    //vai retornar o primeiro registro de acordo com o parametro name
    const product = this.findOne({
      where: {
        name,
      },
    });

    return product;
  }
}
