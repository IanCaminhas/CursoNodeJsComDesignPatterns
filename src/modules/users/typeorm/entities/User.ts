import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  @Exclude() //para excluir do retorno após um get. Precisa dessa importação: import { Exclude } from 'class-transformer';
  password: string;

  @Column()
  avatar: string;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  //pegando o campo avatar e criando a url completa
  //o nome do campo retornado vai ser avatar_url
  @Expose({ name: 'avatar_url' })
  getAvatarUrl(): string | null {
    if (!this.avatar) {
      //existe o atributo avatar ?
      return null; //não existe avatar
    }

    return `${process.env.APP_API_URL}/files/${this.avatar}`; //existe avatar
  }
}

export default User;
