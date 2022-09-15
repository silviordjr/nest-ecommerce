enum Role {
  User = 'user',
  Admin = 'admin',
}

export class CreateUserDto {
  id: string;
  name: string;
  username: string;
  password: string;
  role?: Role;
}
