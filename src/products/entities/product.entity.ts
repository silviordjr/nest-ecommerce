import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  name: string;
  @Column()
  price: number;
  @Column()
  ownerId: string;
}
