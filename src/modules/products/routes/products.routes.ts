import { Router } from 'express';
import ProductsController from '../controllers/ProductsController';

//productsRouter tem todos os metodos delete, put, post, etc.
const productsRouter = Router();
const productsController = new ProductsController();

productsRouter.get('/', productsController.index);
productsRouter.get('/:id', productsController.show);
productsRouter.post('/', productsController.create);
productsRouter.put('/:id', productsController.update);
productsRouter.delete('/:id', productsController.delete);

export default productsRouter;
