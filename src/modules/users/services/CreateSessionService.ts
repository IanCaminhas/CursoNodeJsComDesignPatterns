import AppError from '@shared/http/errors/AppError';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { getCustomRepository } from 'typeorm';
import User from '../typeorm/entities/User';
import UsersRepository from '../typeorm/repositories/UsersRepository';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

class CreateSessionsService {
  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const usersRepository = getCustomRepository(UsersRepository);

    const user = await usersRepository.findByEmail(email);

    /*se nao existir o usuario, lance uma execption
    401 é o statusCode. Refere-se ao statuscode de autorizacao,
    com esse em-mail nao estou autorizado a autenticar */
    if (!user) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    /*O bcrypt compara a senha enviada pelo usuario no formulário
    com a cadastrada no banco de dados(senha criptografada). */
    const passwordConfirmed = await compare(password, user.password);

    if (!passwordConfirmed) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    //depois que as validações foram realizadas(email e senha), gerar token JWT

    /*metodo recebe 3 params:
         1 - payload -> informação que quero devolvver para o usuario.
              Não se deve colocar informações sensiveis no payload, pois ele
              pode ser interceptado e lido por qualquer pessoa.
              Pode ser o id
         2 - Qual vai ser o secret para criar o token ? Posso colocar uma sequencia de caracteres malucos.
            posso acessar o site md5 generator e gerar o secret https://www.md5hashgenerator.com/
            Nesse site, digite qualqur coisa e gera um hash MD5. Exemplo a digitar: ndkjfnkjhfkjdhfjkdhfirh
        3 - Um objeto com demais configurações exigidas para o token.
        */
    const token = sign({}, 'cb213613aaee972824a8841a7affacdb', {
      subject: user.id, //o token a ser usado é o id do usuario
      expiresIn: '1d', //Por quanto tempo esse token vai estar válido ? 1 dia(24h). Ele exprira, aí o usuário vai precisar autenticar novamente para gerar um novo token
    });

    return {
      user,
      token,
    };
  }
}

export default CreateSessionsService;
