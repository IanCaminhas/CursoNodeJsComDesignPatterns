import AppError from '@shared/infra/http/errors/AppError';
import { compare, hash } from 'bcryptjs';
import { inject, injectable } from 'tsyringe';
import { IUpdateProfile } from '../domain/models/IUpdateProfile';
import { IUser } from '../domain/models/IUser';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';

//serviço que vai atualizar o perfil do usuário
@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IUpdateProfile): Promise<IUser> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.');
    }

    /*tenho que garantir que o email a ser atualizado
    não exista na aplicação.
    tenho que considerar

    tambem que o usuario pode nao atualizar o email, ou seja, esta passando mesmo e-mail. Se
    eu fizer a pesquisa, vai encontrar pois é um e-mail que o usuario ja usa*/
    //Em suma: se for o email de outro usuario, preciso disparar a excecao
    const userUpdateEmail = await this.usersRepository.findByEmail(email);
    //userUpdateEmail.id != user.id -> vou usar um e-mail de outro usuario
    if (userUpdateEmail && userUpdateEmail.id != user.id) {
      throw new AppError('There is already one user with this email.');
    }

    //existe uma password e nao existe uma old_password.
    if (password && !old_password) {
      throw new AppError('Old password is required');
    }

    if (password && old_password) {
      //a antiga senha é igual a gravada no bd ?
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError('Old password does not match.');
      }
      //salt -> 8
      user.password = await hash(password, 8);
    }

    //depois de todas as validações, poderei atualizar.
    user.name = name;
    user.email = email;

    await this.usersRepository.save(user);
    return user;
  }
}

export default UpdateProfileService;
