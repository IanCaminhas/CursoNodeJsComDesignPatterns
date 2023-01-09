import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import isAuthenticated from '@shared/middlewares/IsAuthenticated';
import ProfileController from '../controllers/ProfileController';

const profileRouter = Router();
const profileController = new ProfileController();

//até então,, chamo o middleware em cada rota
//como todas rotas vão precisar desse mesmo mmiddleware, posso passar o middleeware na rota mesmo
//todas as rotas serão aplicadas o middleware, ou seja, todos os usuário tem que estar autenticado em todas as rotas que se seguirem
profileRouter.use(isAuthenticated);

profileRouter.get('/', profileController.show);

profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(), //usuario nao quer alterar a senha dele, por isso nao colocar required().
      password: Joi.string().optional(), //pode ser ou nao ser requerido. Preciso colocar o .optional()
      password_confirmation: Joi.string()
        .valid(Joi.ref('password')) //o valor do campo password_confirmation tem que ser igual do campo password
        .when('password', {
          is: Joi.exist(), //se password está preenchido, inclua no password_confirmation o then: Joi.required()
          then: Joi.required(),
        }),
    },
  }),
  profileController.update,
);

export default profileRouter;
