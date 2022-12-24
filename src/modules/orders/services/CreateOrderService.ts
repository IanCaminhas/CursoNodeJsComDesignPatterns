import CustomersRepository from '@modules/customers/typeorm/repositories/CustomersRepository';
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

    //existe qtd suficiente de cada produto ?
    const quantityAvailable = products.filter(
      product =>
        existsProducts.filter(p => p.id === product.id)[0].quantity <
        product.quantity,
    );

    if (quantityAvailable.length) {
      throw new AppError(
        `The quantity ${quantityAvailable[0].quantity} is not available for ${quantityAvailable[0].id}. `,
      );
    }

    /*depois de todas as verificações, vou montar o objeto
    de cada produto recebido, pegar o preço(do cliente so recebo id e quantity)
    */
    //isso é um array com product_id,  quantity e price
    const serializedProducts = products.map(product => ({
      product_id: product.id,
      quantity: product.quantity,
      price: existsProducts.filter(p => p.id === product.id)[0].price,
    }));

    const order = await ordersRepository.createOrder({
      products: serializedProducts,
      customer: customerExists,
    });

    const { order_products } = order;

    //atualizando a quantidade no estoque
    const updatedProductQuantity = order_products.map(product => ({
      id: product.id,
      quantity:
        existsProducts.filter(p => p.id === product.id)[0].quantity -
        product.quantity,
    }));

    await productsRepository.save(updatedProductQuantity);
    return order;
  }
}

export default CreateOrderService;
