import { ICreateProduct } from '@modules/products/domain/models/ICreateProduct';
import { IFindProducts } from '@modules/products/domain/models/IFindProducts';
import { IProduct } from '@modules/products/domain/models/IProduct';
import { IUpdateStockProduct } from '@modules/products/domain/models/IUpdateStockProduct';
import { IProductsRepository } from '@modules/products/domain/repositories/IProductsRepository';
import { getRepository, In, Repository } from 'typeorm';
import Product from '../entities/Product';

export class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;
  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public findById(id: string): Promise<IProduct | undefined> {
    const product = this.ormRepository.findOne(id);
    return product;
  }
  public findAll(): Promise<IProduct[]> {
    const products = this.ormRepository.find();
    return products;
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProduct): Promise<IProduct> {
    const product = this.ormRepository.create({ name, price, quantity });
    await this.ormRepository.save(product);
    return product;
  }

  public async save(product: Product): Promise<Product> {
    await this.ormRepository.save(product);
    return product;
  }

  async updateStock(products: IUpdateStockProduct[]): Promise<void> {
    await this.ormRepository.save(products);
  }

  async remove(product: IProduct): Promise<void> {
    await this.ormRepository.remove(product);
  }
  //todo meotodo async deve retornar uma Promise
  //Promise<Product | undefined> -> a Promise vai retornar um Product ou undefined
  public async findByName(name: string): Promise<Product | undefined> {
    //vai retornar o primeiro registro de acordo com o parametro name
    const product = this.ormRepository.findOne({
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

    const existsProducts = await this.ormRepository.find({
      where: {
        //esse In significa: pega os ids conformes os ids passados em productIds
        //Method In tbm faz as verificações se o ids(tipo uuid) passados estão presentes. Pode ser que um outro não exista
        id: In(productIds),
      },
    });

    return existsProducts;
  }
}
