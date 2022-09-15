import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class crateSalesTable1663251440850 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sales',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '255',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'userId',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'productId',
            type: 'varchar',
            length: '255',
          },
        ],
      }),
      true,
    );

    const foreign1 = new TableForeignKey({
      columnNames: ['userId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'users',
      onDelete: 'CASCADE',
    });

    const foreign2 = new TableForeignKey({
      columnNames: ['productId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'products',
      onDelete: 'CASCADE',
    });

    await queryRunner.createForeignKey('sales', foreign1);
    await queryRunner.createForeignKey('sales', foreign2);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sales');
  }
}
