//Esse arquivo de rotas se refere a questões de alteração de senha
import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import ForgotPasswordController from '../controllers/ForgotPasswordController';

const passwordRouter = Router();
const forgotPasswordController = new ForgotPasswordController();

// No final vou ter a seguinte rota para enviar o email de redefinição de senha -> http://localhost:3333/password/forgot... Se refere a rota criada abaixo
//http://localhost:3333/password/reset -> vou ter essa rota para atualizar a senha
passwordRouter.post(
  '/forgot',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
    },
  }),
  forgotPasswordController.create,
);

export default passwordRouter;
