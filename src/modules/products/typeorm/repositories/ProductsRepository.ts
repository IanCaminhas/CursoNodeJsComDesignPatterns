import { EntityRepository, In, Repository } from 'typeorm';
import Product from '../entities/Product';

//produtos que serão buscados
interface IFindProducts {
  id: string;
}

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

  //retorno todos os produtos conforme os id's informados
  /*sabendo que o id é do tipo uuid, fiz [1,2,3,4] para ilustração abaixo:
    A estrutura products: IFindProducts[] virá da seguinte forma: [1,2,3,4]
  */
  public async findAllByIds(products: IFindProducts[]): Promise<Product[]> {
    const productIds = products.map(product => product.id);

    const existsProducts = await this.find({
      where: {
        //esse In significa: pega os ids conformes os ids passados em productIds
        //Method In tbm faz as verificações se o ids(tipo uuid) passados estão presentes. Pode ser que um outro não exista
        id: In(productIds),
      },
    });

    return existsProducts;
  }
}
