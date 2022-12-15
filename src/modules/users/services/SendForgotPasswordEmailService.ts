import AppError from '@shared/http/errors/AppError';
import { getCustomRepository } from 'typeorm';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import UserTokensRepository from '../typeorm/repositories/UserTokensRepository';
import EtherealMail from '@config/mail/EtherealMail';

interface IRequest {
  email: string;
}

//Service para enviar o link de recuperação de senha
class SendForgotPasswordEmailService {
  //simplesmente vai enviar um email para o usuario. Por isso o Promise<void>
  public async execute({ email }: IRequest): Promise<void> {
    const usersRepository = getCustomRepository(UsersRepository);
    const userTokensRepository = getCustomRepository(UserTokensRepository);

    //esse email existe em algum usuario da aplicação?
    const user = await usersRepository.findByEmail(email);

    //se o usuario nao existir... gera uma exception
    if (!user) {
      throw new AppError('User does not exists.');
    }
    //se o user existir, gere um token
    const token = await userTokensRepository.generate(user.id);

    // console.log(token);

    await EtherealMail.sendMail({
      to: email, //para quem vou enviar o e-mail ?
      body: `Solicitação de redefinição de senha recebida1: ${token?.token}`,
    });
  }
}

export default SendForgotPasswordEmailService;
