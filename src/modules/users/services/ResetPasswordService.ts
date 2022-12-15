import AppError from '@shared/http/errors/AppError';
import { getCustomRepository } from 'typeorm';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import UserTokensRepository from '../typeorm/repositories/UserTokensRepository';
import { isAfter, addHours } from 'date-fns';
import { hash } from 'bcryptjs';

interface IRequest {
  token: string;
  password: string;
}

//Service resp. por atualizar a senha o do user
/* Verificar: se o token enviado é valido(da hora que foi enviado, já se passou 2 horas ?).
              Se passou de 2 horas, gerar a exception
              User existe na aplicação ? */
//O password passado pelo user não está criptografado.
class ResetPasswordService {
  public async execute({ token, password }: IRequest): Promise<void> {
    const usersRepository = getCustomRepository(UsersRepository);
    const userTokensRepository = getCustomRepository(UserTokensRepository);
    //Verifica a existencia do token
    const userToken = userTokensRepository.findByToken(token);
    //se o token nao existir, lança a exception: token não existe
    if (!userToken) {
      throw new AppError('User Token does not exists.');
    }

    //Token foi encontrado. blz. Vamos ver se o usuario existe na aplicação
    const user = await usersRepository.findById(userToken.user_id);

    //Se nao encontrar o usuario, lanço a excepction: usuario nao existe.
    if (!user) {
      throw new AppError('User does not exists.');
    }

    //O token ainda se encontra com prazo de validade ? o token já passou mais de 2 horas da criação dele ?
    //Precisamos mexer com cálculo de tempo. Biblioteca: date-fns
    const tokenCreatedAt = userToken.created_at;
    const compareDate = addHours(tokenCreatedAt, 2); //pega o horario do token e soma mais duas horas

    //Já decorreu mais de 2 horas após a criação do Token ?
    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Token expired.');
    }

    // Como a senha não está criptografada, vamos fazer isso.
    user.password = await hash(password, 8);
  }
}

export default ResetPasswordService;
