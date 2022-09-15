import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { HashManager } from './../helpers/HashManager';
import IdGenerator from './../helpers/IdGenerator';
import { Authenticator } from './../helpers/Authenticator';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const hashedPass = new HashManager().createHash(createUserDto.password);
    createUserDto.password = hashedPass;
    createUserDto.id = new IdGenerator().generateId();
    const user = this.userRepo.create(createUserDto);
    return this.userRepo.save(user);
  }

  findAll(authorization: string) {
    const tokenData = new Authenticator().getTokenData(authorization);

    if (!tokenData) {
      throw new Error('Token Inválido.');
    }

    return this.userRepo.find();
  }

  findOne(id: number, authorization: string) {
    const tokenData = new Authenticator().getTokenData(authorization);

    if (!tokenData) {
      throw new Error('Token Inválido.');
    }
    return `This action returns a #${id} user`;
  }

  async update(updateUserDto: UpdateUserDto) {
    const user = await this.userRepo.find({
      where: {
        username: updateUserDto.username,
      },
    });

    if (!user) {
      throw new Error('Insira email e senha válidos!');
    }

    const passwordIsCorrect = new HashManager().compareHash(
      updateUserDto.password,
      user[0].password,
    );

    if (!passwordIsCorrect) {
      throw new Error('Insira email e senha válidos!');
    }

    const token = new Authenticator().generateToken({
      id: user[0].id,
      role: user[0].role,
    });

    return { token: token };
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
