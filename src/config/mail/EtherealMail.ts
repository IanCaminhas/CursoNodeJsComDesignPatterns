import nodemailer from 'nodemailer';
import HandlebarsMailTemplate from './HandlebarsMailTemplate';

interface ITemplateVariable {
  [key: string]: string | number;
}

interface IParseMailTemplate {
  template: string;
  variables: ITemplateVariable;
}

//desmembrei o to em name and email
interface IMailContact {
  name: string;
  email: string;
}

interface ISendMail {
  to: IMailContact; //para quem ? antes estava string. Ao invés de receber como string, vou receber dois valores
  from?: IMailContact; //esse from é opcional, olhe o ?:
  subject: string;
  templateData: IParseMailTemplate; // body: string era o corpo do email. Antes era estatico. AGORA Quero enviar o template
}

export default class EtherealMail {
  //a mensagem que vai no email com os responsáveis.
  static async sendMail({
    to,
    from,
    subject,
    templateData,
  }: ISendMail): Promise<void> {
    //conta fake
    const account = await nodemailer.createTestAccount();

    const mailTemplate = new HandlebarsMailTemplate();

    const transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });

    /* Antes do handlebars, o conteudo era estatico. Agora e dinâmico
    const message = await transporter.sendMail({
      from: 'equipe@apivendas.com.br', //email fake
      to,
      subject: 'Recuperação de senha',
      text: body,
    }); */

    const message = await transporter.sendMail({
      from: {
        name: from?.name || 'Equipe API Vendas',
        address: from?.email || 'equipe@apivendas.com.br',
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await mailTemplate.parse(templateData), //envio do html e as variaveis para fazer o parse
    });

    console.log('Message sent: &s', message.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}
