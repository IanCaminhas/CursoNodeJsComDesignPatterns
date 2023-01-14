/*
Objetivo desse container: injetar o repository no service... Esta sendo etstatdo no modulo customers
*/
import { container } from 'tsyringe';
import { ICustomersRepository } from '@modules/customers/domain/repositories/ICustomersRepository';
import CustomersRepository from '@modules/customers/infra/typeorm/repositories/CustomersRepository';

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
