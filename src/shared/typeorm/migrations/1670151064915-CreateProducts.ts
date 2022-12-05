import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateProducts1670151064915 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'products',
        columns: [
          {
            name: 'id',
            type: 'uuid', //não é preciso atribuir manualmente seu valor antes de salvar, pois o valor será gerado automaticamente.
            isPrimary: true,
            generationStrategy: 'uuid', //não é preciso atribuir manualmente seu valor antes de salvar, pois o valor será gerado automaticamente.
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'price',
            type: 'decimal',
            precision: 10, //precisao na parte inteira
            scale: 2, //ou seja, duas casa decimais
          },
          {
            name: 'quantity',
            type: 'int',
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
    //apagando a tabela products
    await queryRunner.dropTable('products');
  }
}
