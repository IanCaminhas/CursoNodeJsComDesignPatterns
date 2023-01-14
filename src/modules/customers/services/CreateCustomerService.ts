import AppError from '@shared/infra/http/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { ICustomer } from '../domain/models/ICostumer';
import { ICreateCustomer } from '../domain/models/ICreateCustomer';
import { ICustomersRepository } from '../domain/repositories/ICustomersRepository';

/*
  @injectable() e @inject('CustomersRepository')
vai diretamente no container buscar a deependência
e vai injetar no serviço.

Essa busca vai ser em shared/config/container/index.ts
*/

@injectable()
class CreateCustomerService {
  constructor(
    //o container resolve essa injeção aqui
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ name, email }: ICreateCustomer): Promise<ICustomer> {
    //email não pode ser repetido.
    const emailExists = await this.customersRepository.findByEmail(email);

    if (emailExists) {
      throw new AppError('Email address already user.');
    }

    const customer = await this.customersRepository.create({
      name,
      email,
    });

    return customer;
  }
}

export default CreateCustomerService;
