/*
Objetivo desse container: injetar o repository no service... Esta sendo etstatdo no modulo customers
*/
import { container } from 'tsyringe';
import { ICustomersRepository } from '@modules/customers/domain/repositories/ICustomersRepository';
import CustomersRepository from '@modules/customers/infra/typeorm/repositories/CustomersRepository';
import { IProductsRepository } from '@modules/products/domain/repositories/IProductsRepository';
import { ProductsRepository } from '@modules/products/infra/typeorm/repositories/ProductsRepository';
import { IOrdersRepository } from '@modules/orders/domain/repositories/IOrdersRepository';
import OrdersRepository from '@modules/orders/infra/typeorm/repositories/OrdersRepository';
import { IUsersRepository } from '@modules/users/domain/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import { IUserTokensRepository } from '@modules/users/domain/repositories/IUserTokensRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';

//formas de registrar o repositório no container
/*
  A cada ciclo de vida aplicação, o registerSingleton vai manter uma única instância de CustomersRepository.
  Param1: uma chave identificadora.
  Param1: a própria classe.

  Por que importei o ICustomersRepository ?
  Para definir a tipagem
  Assim, garanto que, quando usar o repositório, vai está seguindo a regra da camada de domínio.
*/

container.registerSingleton<ICustomersRepository>(
  'CustomersRepository',
  CustomersRepository,
);

container.registerSingleton<IProductsRepository>(
  'ProductsRepository',
  ProductsRepository,
);

container.registerSingleton<IOrdersRepository>(
  'OrdersRepository',
  OrdersRepository,
);

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);
