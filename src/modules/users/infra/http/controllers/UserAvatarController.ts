import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import { container } from 'tsyringe';

export default class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const updateAvatar = container.resolve(UpdateUserAvatarService);

    const user = updateAvatar.execute({
      user_id: request.user.id,
      avatarFileName: request.file?.filename,
    });

    return response.json(instanceToInstance(user));
  }
}
