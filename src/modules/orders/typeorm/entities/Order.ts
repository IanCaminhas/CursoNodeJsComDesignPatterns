import Customers from '@modules/customers/typeorm/entities/Customer';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import OrdersProducts from './OrdersProducts';

@Entity('orders')
class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Customers)
  @JoinColumn({ name: 'customer_id' })
  customer: Customers;

  //lembre: é um array pq é @OneToMany
  /*
    Toda que salvar uma Order, preciso salvar os OrdersProducts.
    Como proceder o salvamento ? cascade: true
  */
  @OneToMany(() => OrdersProducts, order_products => order_products.order, {
    cascade: true, //Toda vez que criar uma order, todos os OrdersProducts relacionados a essa order ja vao ser salvas automaticamente no bd
  })
  order_products: OrdersProducts[];

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;
}

export default Order;
