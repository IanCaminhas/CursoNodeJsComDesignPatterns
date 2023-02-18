import AppError from '@shared/infra/http/errors/AppError';
import path from 'path';
import uploadConfig from '@config/upload';
import fs from 'fs';
import { inject, injectable } from 'tsyringe';
import { IUpdateUserAvatar } from '../domain/models/IUpdateUserAvatar';
import { IUser } from '../domain/models/IUser';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
    avatarFileName,
  }: IUpdateUserAvatar): Promise<IUser> {
    /*Pra fazer o upload do avatar na aplicação: token valido na aplicação,
    tiver autenticado(user_id tem que ser informado, ou seja, tem que ser encontrado pelo aplicação)
    O usuário está querendo atualizar um avatar já existente ou inserir o
    primeiro avatar ? se for atualizar, apagar o avatar e enviar um novo avatar
    */
    const user = await this.usersRepository.findById(user_id);

    // se não encontrou um user, dispara a esception
    if (!user) {
      throw new AppError('User not found. ');
    }

    // user tem avatar atualmente ?
    if (user.avatar) {
      //vou pegar o caminho de onde o arquivo esta armazenado
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      //se o avatar existe, deletar arquivo
      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath); //unlink remove arquivos do sistema de arquivos
      }
    }
    //apos as verificações, atualizar avatar
    user.avatar = avatarFileName;
    //depois, salvar
    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
