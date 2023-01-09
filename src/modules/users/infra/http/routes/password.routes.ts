//Esse arquivo de rotas se refere a questões de alteração de senha
import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import ForgotPasswordController from '../controllers/ForgotPasswordController';
import ResetPasswordController from '../controllers/ResetPasswordController';

const passwordRouter = Router();
const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();

// No final vou ter a seguinte rota para enviar o email de redefinição de senha -> http://localhost:3333/password/forgot... Se refere a rota criada abaixo
passwordRouter.post(
  '/forgot',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
    },
  }),
  forgotPasswordController.create,
);

//http://localhost:3333/password/reset -> vou ter essa rota para atualizar a senha
passwordRouter.post(
  '/reset',
  celebrate({
    [Segments.BODY]: {
      token: Joi.string().uuid().required(),
      password: Joi.string().required(),
      /*
        Geralmente, o usuario envia duas senhas: a nova e a confirmação de senha
        passo para o valid de qual informação ele quer comparar.
        Qual nome do campo que quero comparar ? password
        Olha validaçao, password_confirmation tem que ser igual a referência
        passada para o valid. password: = valid('password')
      */
      password_confirmation: Joi.string().required().valid(Joi.ref('password')),
    },
  }),
  resetPasswordController.create,
);

export default passwordRouter;
