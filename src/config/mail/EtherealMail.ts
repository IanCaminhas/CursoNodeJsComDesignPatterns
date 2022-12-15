import nodemailer from 'nodemailer';

interface ISendMail {
  to: string; //para quem ?
  body: string;
}

export default class EtherealMail {
  //a mensagem que vai no email com os responsáveis.
  static async sendMail({ to, body }: ISendMail): Promise<void> {
    const account = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });

    const message = await transporter.sendMail({
      from: 'equipe@apivendas.com.br', //email fake
      to,
      subject: 'Recuperação de senha',
      text: body,
    });

    console.log('Message sent: &s', message.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}
