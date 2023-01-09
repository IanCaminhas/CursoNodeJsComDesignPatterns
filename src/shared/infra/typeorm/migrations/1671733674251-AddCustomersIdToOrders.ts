import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddCustomersIdToOrders1671733674251 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'orders', //em qual tabela estou inserindo as novas colunas ?
      new TableColumn({
        name: 'customer_id',
        type: 'uuid',
        /* Por que uma FK nula ? O user pode ser removido da aplicação, ou seja, lá na tabela customer o customer_id não existe mais
        O que fazer com esses pedidos relacionados ao cliente ?
        Apaga os pedidos tbm ? não é uma boa ideia.
        Objetivo: manter os registros na tabela orders de um cliente que não existe mais,
        Solução: devo permitir que a FK seja nula
        */
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'orders',
      //esse campo que refiro nos comentários abaixo, se refere a name: 'custom_id',
      new TableForeignKey({
        name: 'OrdersCustomer', //nome da foreign key
        columnNames: ['customer_id'], //nome da coluna que se relaciona com o id da tabela customers
        referencedTableName: 'customers', // Em qual tabela esse campo está referenciando ?
        referencedColumnNames: ['id'], //Qual o campo da tabela customers ?
        /*o que faço com esse registro da tabela de orders quando o id do ciente não existir mais, ou seja, quando o cliente for deletado lá de customers.
        como coloquei que o campo pode ser nulo, posso usar SET NULL */
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    //olha a ordem abaixo existe sentido. Apagar a FK OrdersCustomer para depois apagar a coluna customer_id de orders
    await queryRunner.dropForeignKey('orders', 'OrdersCustomer');
    await queryRunner.dropColumn('orders', 'customer_id');
  }
}
