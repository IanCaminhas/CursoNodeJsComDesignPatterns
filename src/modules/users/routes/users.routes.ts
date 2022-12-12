import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import UsersController from '../controllers/UsersController';
import UserAvatarController from '../controllers/userAvatarController';
import isAuthenticated from '../../../shared/middlewares/IsAuthenticated';
import multer from 'multer';
import uploadConfig from '@config/upload';

const usersRouter = Router();
const usersController = new UsersController();
const usersAvatarController = new UserAvatarController();

//middleware de envio de arquivo
//definição do multer já com as configurações definidas.
const upload = multer(uploadConfig);

//isAuthenticated é o middleware de autenticação
usersRouter.get('/', isAuthenticated, usersController.index);

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  usersController.create,
);
//permite a atualização de único dado(no caso é o avatar)
//vai ser /users/avatar
usersRouter.patch(
  '/avatar',
  isAuthenticated, //usuario esta autenticado para fazer o upload do avatar ?
  upload.single('avatar'), //single() significa o upload de único arquivo. avatar é o nome do campo lá na hora do insomnia
  usersAvatarController.update,
);

export default usersRouter;
