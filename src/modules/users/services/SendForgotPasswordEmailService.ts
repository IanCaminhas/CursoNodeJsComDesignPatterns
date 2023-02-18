import AppError from '@shared/infra/http/errors/AppError';
import path from 'path';
import EtherealMail from '@config/mail/EtherealMail';
import { inject, injectable } from 'tsyringe';
import { ISendForgotPasswordEmail } from '../domain/models/ISendForgotPasswordEmail';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';
import { IUserTokensRepository } from '../domain/repositories/IUserTokensRepository';

//Service para enviar o link de recuperação de senha
@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  //simplesmente vai enviar um email para o usuario. Por isso o Promise<void>
  public async execute({ email }: ISendForgotPasswordEmail): Promise<void> {
    //esse email existe em algum usuario da aplicação?
    const user = await this.usersRepository.findByEmail(email);

    //se o usuario nao existir... gera uma exception
    if (!user) {
      throw new AppError('User does not exists.');
    }
    //se o user existir, gere um token
    const { token } = await this.userTokensRepository.generate(user.id);

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
