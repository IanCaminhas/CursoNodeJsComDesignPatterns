import AppError from '@shared/http/errors/AppError';
import { compare, hash } from 'bcryptjs';
import { getCustomRepository } from 'typeorm';
import User from '../typeorm/entities/User';
import UsersRepository from '../typeorm/repositories/UsersRepository';

interface IRequest {
  email: string;
  password: string;
}

class CreateSessionsService {
  public async execute({ email, password }: IRequest): Promise<User> {
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

    return user;
  }
}

export default CreateSessionsService;
