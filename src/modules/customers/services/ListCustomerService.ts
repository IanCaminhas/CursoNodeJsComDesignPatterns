import { inject, injectable } from 'tsyringe';
import { ICustomersRepository } from '../domain/repositories/ICustomersRepository';
import Customer from '../infra/typeorm/entities/Customer';

/*
A paginação deu errada. Diante do exposto, deixei a solução inicial que pode ser compilada abaixo.
Motivo: biblioteca esta desatualizada ou esta em desuso
interface IPaginateCustomer {
  from: number;
  to: number;
  per_page: number;
  total: number;
  current_page: number;
  prev_page: number | null;
  next_page: number | null;
  data: Customer[];
}

class ListCustomerService {
  public async execute(): Promise<IPaginateCustomer[]> {
    const customersRepository = getCustomRepository(CustomersRepository);
    const customers = await customersRepository.createQueryBuilder().paginate();
    return customers;
  }
}
*/
@injectable()
class ListCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute(): Promise<Customer[] | undefined> {
    const customers = await this.customersRepository.findAll();
    return customers;
  }
}

export default ListCustomerService;
