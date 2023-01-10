import { ICustomer } from '@modules/customers/domain/models/ICostumer';
import { ICreateCustomer } from '@modules/customers/domain/models/ICreateCustomer';
import { ICustomersRepository } from '@modules/customers/domain/repositories/ICustomersRepository';
import { getRepository, Repository } from 'typeorm';
import Customer from '../entities/Customer';

//a classe não fica mais acoplada aos recursos do TypeORM... Passei para o atributo ormRepository: Repository<Customer>;
class CustomersRepository implements ICustomersRepository {
  //Estou falando que essa estrutura vai manipular um repositório de clientes
  private ormRepository: Repository<Customer>;
  constructor() {
    this.ormRepository = getRepository(Customer);
  }

  public async create({ name, email }: ICreateCustomer): Promise<ICustomer> {
    const customer = this.ormRepository.create({
      name,
      email,
    });

    await this.ormRepository.save(customer);
    return customer;
  }

  public async save(customer: Customer): Promise<ICustomer> {
    await this.ormRepository.save(customer);
    return customer;
  }

  public async findByName(name: string): Promise<Customer | undefined> {
    //Fazendo assim, agora tenho todos os metodos do typeorm novamente
    const customer = await this.ormRepository.findOne({
      where: {
        name,
      },
    });

    return customer;
  }

  public async findById(id: string): Promise<Customer | undefined> {
    const customer = await this.ormRepository.findOne({
      where: {
        id,
      },
    });
    return customer;
  }

  public async findByEmail(email: string): Promise<Customer | undefined> {
    const customer = await this.ormRepository.findOne({
      where: {
        email,
      },
    });

    return customer;
  }
}

export default CustomersRepository;
