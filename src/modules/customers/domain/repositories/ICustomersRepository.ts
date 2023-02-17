import { ICustomer } from '../models/ICostumer';
import { ICreateCustomer } from '../models/ICreateCustomer';

export interface ICustomersRepository {
  //ICustomer é uma interface da camada de domínio
  //Esses metodos nao sao do typeorm
  findByName(name: string): Promise<ICustomer | undefined>;
  findAll(): Promise<ICustomer[] | undefined>;
  findById(id: string): Promise<ICustomer | undefined>;
  findByEmail(email: string): Promise<ICustomer | undefined>;
  //esses dois metodos sao do typeorm
  create(data: ICreateCustomer): Promise<ICustomer>;
  save(customer: ICustomer): Promise<ICustomer>;
  remove(customer: ICustomer): Promise<void>;
}
