import productsRouter from '@modules/products/routes/products.routes';
import { Router } from 'express';

const routes = Router();

/*
  Quando acessar /products, ele vai acessar as rotas de productsRoutes
  Exemplo: /products/id/-> :id foi defindo em products.routes.ts
*/
routes.use('/products', productsRouter);
/*
Rota de teste
routes.get('/', (request, response) => {
  return response.json({ message: 'Hello Dev!' });
});
*/

export default routes;
