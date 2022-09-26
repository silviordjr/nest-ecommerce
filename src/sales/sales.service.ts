import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Authenticator } from 'src/helpers/Authenticator';
import { Repository } from 'typeorm';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Sale } from './entities/sale.entity';
import CustomError from './../exceptions/CustomError';
import { Product } from 'src/products/entities/product.entity';
import IdGenerator from './../helpers/IdGenerator';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private saleRepo: Repository<Sale>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  async create(createSaleDto: CreateSaleDto, authorization: string) {
    const tokenData = new Authenticator().getTokenData(authorization);

    if (!tokenData) {
      throw new CustomError(HttpStatus.UNAUTHORIZED, 'Token inválido.');
    }

    if (!createSaleDto.productId) {
      throw new CustomError(HttpStatus.BAD_REQUEST, 'ID de produto inválida.');
    }

    const product = await this.productRepo.findOne({
      where: {
        id: createSaleDto.productId,
      },
    });

    if (!product) {
      throw new CustomError(HttpStatus.BAD_REQUEST, 'ID de produto inválida.');
    }

    if (tokenData.id === product.ownerId) {
      throw new CustomError(HttpStatus.FORBIDDEN, 'Sem autorização.');
    }

    const id = new IdGenerator().generateId();

    createSaleDto.id = id;
    createSaleDto.userId = tokenData.id;

    const sale = this.saleRepo.create(createSaleDto);

    return this.saleRepo.save(sale);
  }

  findAll() {
    return `This action returns all sales`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sale`;
  }

  update(id: number, updateSaleDto: UpdateSaleDto) {
    return `This action updates a #${id} sale`;
  }

  remove(id: number) {
    return `This action removes a #${id} sale`;
  }
}
