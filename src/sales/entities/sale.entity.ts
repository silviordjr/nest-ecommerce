import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'sales' })
export class Sale {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  userId: string;
  @Column()
  productId: string;
}
