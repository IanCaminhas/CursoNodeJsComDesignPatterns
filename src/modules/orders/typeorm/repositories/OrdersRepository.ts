import Customer from '@modules/customers/typeorm/entities/Customer';
import { EntityRepository, Repository } from 'typeorm';
import Order from '../entities/Order';

/*
  nao preciso de todos os campos da entidade Product.
  Para isso crio essa interface para servir de tipo em
  products: IProduct[]; em interface IRequest
*/
interface IProduct {
  product_id: string;
  price: number;
  quantity: number;
}

interface IRequest {
  customer: Customer;
  products: IProduct[];
}

@EntityRepository(Order)
export class OrdersRepository extends Repository<Order> {
  public async findById(id: string): Promise<Order | undefined> {
    const order = this.findOne(id, {
      /*estamos falando para p/ o findOne que
      é para trazer os dados da order(id,) do pedido e
      os dados relacionados ao id: order_products(produtos pedidos pelo cliente) e customer
      */
      relations: ['order_products', 'customer'],
    });
    return order;
  }

  public async createOrder({ customer, products }: IRequest): Promise<Order> {
    const order = this.create({
      customer,
      order_products: products,
    });

    await this.save(order);
    return order;
  }
}
