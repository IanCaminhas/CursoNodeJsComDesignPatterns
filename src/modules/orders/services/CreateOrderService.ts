import CustomersRepository from '@modules/customers/typeorm/repositories/CustomersRepository';
import Product from '@modules/products/typeorm/entities/Product';
import { ProductRepository } from '@modules/products/typeorm/repositories/ProductsRepository';
import AppError from '@shared/http/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Order from '../typeorm/entities/Order';
import { OrdersRepository } from '../typeorm/repositories/OrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

class CreateOrderService {
  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    //Aqui precisaremos recuperar as orders, o cliente e os products da order
    const ordersRepository = getCustomRepository(OrdersRepository);
    const customersRepository = getCustomRepository(CustomersRepository);
    const productsRepository = getCustomRepository(ProductRepository);

    //verificar se o cliente existe
    const customerExists = await customersRepository.findById(customer_id);
    if (customerExists) {
      throw new AppError('Could not find any customer with given id');
    }

    //Vai retornar aqui todos os produtos que foram encontrados
    //Mas se eonctrar algum id que não foi encontrado ?
    const existsProducts = await productsRepository.findAllByIds(products);

    //se o array vier vazio...
    if (!existsProducts.length) {
      throw new AppError('Could not find any products with given ids');
    }

    const existsProductsIds = existsProducts.map(product => product.id);

    //todos os ids foram encontrados ? existem produtos inexistentes ?
    const checkInexistenteProducts = products.filter(
      Product => !existsProductsIds.includes(Product.id),
    );

    if (checkInexistenteProducts.length) {
      throw new AppError(
        `Could not find product ${checkInexistenteProducts[0].id}.`,
      );
    }
  }
}

export default CreateOrderService;
