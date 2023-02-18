import { ICreateProduct } from '../models/ICreateProduct';
import { IFindProducts } from '../models/IFindProducts';
import { IProduct } from '../models/IProduct';
import { IUpdateStockProduct } from '../models/IUpdateStockProduct';

export interface IProductsRepository {
  findByName(name: string): Promise<IProduct | undefined>;
  findById(id: string): Promise<IProduct | undefined>;
  findAll(): Promise<IProduct[]>;
  findAllByIds(products: IFindProducts[]): Promise<IProduct[]>;
  create(data: ICreateProduct): Promise<IProduct>;
  save(product: IProduct): Promise<IProduct>;
  updateStock(products: IUpdateStockProduct[]): Promise<void>;
  remove(product: IProduct): Promise<void>;
}
