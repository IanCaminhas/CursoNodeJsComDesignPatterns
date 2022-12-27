import AppError from '@shared/http/errors/AppError';
import { getCustomRepository } from 'typeorm';
import path from 'path';
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
    const { token } = await userTokensRepository.generate(user.id);

    // console.log(token);
    const forgotPasswrodTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs',
    );

    await EtherealMail.sendMail({
      to: {
        //para quem vou enviar o e-mail ?
        name: user.name,
        email: user.email,
      },
      subject: '[API Vendas] Recuperação de Senha',
      templateData: {
        //no final, vamos ter o html construído
        file: forgotPasswrodTemplate,
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/reset_password?token=${token}`,
        },
      },
    });
  }
}

export default SendForgotPasswordEmailService;
