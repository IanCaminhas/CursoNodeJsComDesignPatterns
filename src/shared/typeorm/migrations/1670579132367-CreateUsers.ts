import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsers1670579132367 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'avatar',
            type: 'varchar',
            isNullable: true, //pode ser um campo vazio. Por padrão, todo campo é requerido
          },
          {
            name: 'created_at', //tem o registro de quando o campo foi criado
            type: 'timestamp', //tem o registro de quando foi criado
            default: 'now()', //now() é uma função que sempre vai preencher a data atual
          },
          {
            name: 'updated_at', //tem o registro de quando o campo foi atualizado
            type: 'timestamp', //tem o registro de quando foi modificado pela ultima vez
            default: 'now()', //now() é uma função que sempre vai preencher a data atual
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
