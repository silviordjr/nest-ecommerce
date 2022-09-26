import { Injectable, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { HashManager } from './../helpers/HashManager';
import IdGenerator from './../helpers/IdGenerator';
import { Authenticator } from './../helpers/Authenticator';
import CustomError from './../exceptions/CustomError';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto, authorization: string) {
    const tokenData = new Authenticator().getTokenData(authorization);
    const hashedPass = new HashManager().createHash(createUserDto.password);

    createUserDto.password = hashedPass;
    createUserDto.id = new IdGenerator().generateId();

    const user = this.userRepo.create(createUserDto);

    if (user.role === 'admin' && (!tokenData || tokenData.role !== 'admin')) {
      throw new CustomError(
        HttpStatus.FORBIDDEN,
        'Sem autorização para criação de usuário admin.',
      );
    }

    return this.userRepo.save(user);
  }

  findAll(authorization: string) {
    const tokenData = new Authenticator().getTokenData(authorization);

    if (!tokenData) {
      throw new CustomError(HttpStatus.UNAUTHORIZED, 'Token Inválido.');
    }

    return this.userRepo.find();
  }

  async findOne(id: string, authorization: string, page: number) {
    const tokenData = new Authenticator().getTokenData(authorization);

    if (!tokenData) {
      throw new CustomError(HttpStatus.UNAUTHORIZED, 'Token Inválido.');
    }

    if (tokenData.id !== id && tokenData.role !== 'admin') {
      throw new CustomError(HttpStatus.FORBIDDEN, 'Sem autorização.');
    }

    const offset = 10 * (page - 1);

    const query = `select products.id as id, products.name as name, products.price as price, products.ownerId as ownerId, users.name as owner from products inner join users on products.ownerId  = users.id where users.id = '${id}' limit 10  offset ${offset};`;
    const products = await this.userRepo.query(query);
    const productsObj = { products: products, page: page };
    const user = await this.userRepo.find({
      where: {
        id: id,
      },
    });

    const userData = { user: user, products: productsObj };

    return userData;
  }

  async update(updateUserDto: UpdateUserDto) {
    const user = await this.userRepo.find({
      where: {
        username: updateUserDto.username,
      },
    });

    if (!user) {
      throw new CustomError(
        HttpStatus.NOT_FOUND,
        'Insira email e senha válidos!',
      );
    }

    const passwordIsCorrect = new HashManager().compareHash(
      updateUserDto.password,
      user[0].password,
    );

    if (!passwordIsCorrect) {
      throw new CustomError(
        HttpStatus.NOT_FOUND,
        'Insira email e senha válidos!',
      );
    }

    const token = new Authenticator().generateToken({
      id: user[0].id,
      role: user[0].role,
    });

    return { token: token };
  }

  async remove(id: string, authorization: string) {
    const tokenData = new Authenticator().getTokenData(authorization);

    if (!tokenData) {
      throw new CustomError(HttpStatus.UNAUTHORIZED, 'Token Inválido.');
    }

    if (tokenData.id !== id && tokenData.role !== 'admin') {
      throw new CustomError(HttpStatus.FORBIDDEN, 'Sem autorização.');
    }

    await this.userRepo.delete(id);

    return { message: 'OK.' };
  }
}
