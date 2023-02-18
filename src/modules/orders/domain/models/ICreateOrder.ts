import { ICustomer } from '@modules/customers/domain/models/ICostumer';
import { ICreateOrderProducts } from './ICreateOrderProducts';

export interface ICreateOrder {
  customer: ICustomer;
  products: ICreateOrderProducts[];
}
