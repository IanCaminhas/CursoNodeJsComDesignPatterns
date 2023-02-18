import { getRepository, Repository } from 'typeorm';
import { ICreateOrder } from '@modules/orders/domain/models/ICreateOrder';
import { IOrder } from '@modules/orders/domain/models/IOrder';
import { IOrdersRepository } from '@modules/orders/domain/repositories/IOrdersRepository';
import Order from '../entities/Order';

/*
  nao preciso de todos os campos da entidade Product.
  Para isso crio essa interface para servir de tipo em
  products: IProduct[]; em interface IRequest
*/

class OrdersRepository implements IOrdersRepository {
  private ormRepository: Repository<Order>;

  constructor() {
    this.ormRepository = getRepository(Order);
  }

  async create({ customer, products }: ICreateOrder): Promise<IOrder> {
    const order = this.ormRepository.create({
      customer,
      order_products: products,
    });

    await this.ormRepository.save(order);
    return order;
  }

  public async findById(id: string): Promise<Order | undefined> {
    const order = this.ormRepository.findOne(id, {
      /*estamos falando para p/ o findOne que
      é para trazer os dados da order(id,) do pedido e
      os dados relacionados ao id: order_products(produtos pedidos pelo cliente) e customer
      */
      relations: ['order_products', 'customer'],
    });
    return order;
  }
}

export default OrdersRepository;
