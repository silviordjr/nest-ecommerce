import { HttpStatus, Injectable } from '@nestjs/common';
import { Authenticator } from 'src/helpers/Authenticator';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import CustomError from './../exceptions/CustomError';
import IdGenerator from './../helpers/IdGenerator';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  create(createProductDto: CreateProductDto, authorization: string) {
    const tokenData = new Authenticator().getTokenData(authorization);

    if (!tokenData) {
      throw new CustomError(HttpStatus.UNAUTHORIZED, 'Token Inválido.');
    }

    const productId = new IdGenerator().generateId();

    createProductDto.id = productId;
    createProductDto.ownerId = tokenData.id;

    const product = this.productRepo.create(createProductDto);

    return this.productRepo.save(product);
  }

  async findAll(page: number) {
    const offset = 10 * (page - 1);

    const query = `select products.id as id, products.name as name, products.price as price, products.ownerId as ownerId, users.name as owner from products inner join users on products.ownerId  = users.id limit 10 offset ${offset};`;

    const products = await this.productRepo.query(query);

    const result = { products: products, page: page };

    return result;
  }

  async findOne(id: string) {
    const query = `select products.id as id, products.name as name, products.price as price, products.ownerId as ownerId, users.name as owner from products inner join users on products.ownerId  = users.id WHERE products.id = '${id}'`;

    const products = await this.productRepo.query(query);

    return products;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    authorization: string,
  ) {
    const tokenData = new Authenticator().getTokenData(authorization);

    if (!tokenData) {
      throw new CustomError(HttpStatus.UNAUTHORIZED, 'Token Inválido.');
    }

    const product = await this.productRepo.findOne({
      where: {
        id,
      },
    });

    if (tokenData.id !== product.ownerId) {
      throw new CustomError(HttpStatus.FORBIDDEN, 'Sem autorização.');
    }

    const updateResult = await this.productRepo.update(id, updateProductDto);

    if (updateResult.affected > 0) {
      return this.productRepo.findOne({
        select: { id: true, name: true, price: true, ownerId: true },
        where: { id: id },
      });
    } else {
      throw new EntityNotFoundError(Product, id);
    }
  }

  async remove(id: string, authorization: string) {
    const tokenData = new Authenticator().getTokenData(authorization);

    if (!tokenData) {
      throw new CustomError(HttpStatus.UNAUTHORIZED, 'Token Inválido.');
    }

    const product = await this.productRepo.findOne({
      where: {
        id,
      },
    });

    if (tokenData.id !== product.ownerId && tokenData.role !== 'admin') {
      throw new CustomError(HttpStatus.FORBIDDEN, 'Sem autorização.');
    }

    await this.productRepo.delete(id);

    return { message: 'Ok.' };
  }
}
