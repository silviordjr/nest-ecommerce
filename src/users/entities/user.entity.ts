import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

enum Role {
  User = 'user',
  Admin = 'admin',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  name: string;
  @Column()
  username: string;
  @Column()
  password: string;
  @Column()
  role?: Role;
}

export type authenticationData = {
  id: string;
  role: Role;
};
