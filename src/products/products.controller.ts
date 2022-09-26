import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  UseFilters,
  HttpException,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { HttpExceptionFilter } from './../exceptions/http-exception.filter';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseFilters(HttpExceptionFilter)
  create(
    @Body() createProductDto: CreateProductDto,
    @Headers('authorization') authorization: string,
  ) {
    try {
      return this.productsService.create(createProductDto, authorization);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get()
  @UseFilters(HttpExceptionFilter)
  async findAll(@Query('page') page: number) {
    try {
      if (!page) {
        page = 1;
      }

      const products = await this.productsService.findAll(page);

      return products;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get(':id')
  @UseFilters(HttpExceptionFilter)
  async findOne(@Param('id') id: string) {
    try {
      const product = await this.productsService.findOne(id);

      return product;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Patch(':id')
  @UseFilters(HttpExceptionFilter)
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Headers('authorization') authorization: string,
  ) {
    try {
      const product = await this.productsService.update(
        id,
        updateProductDto,
        authorization,
      );

      return product;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete(':id')
  @UseFilters(HttpExceptionFilter)
  async remove(
    @Param('id') id: string,
    @Headers('authorization') authorization: string,
  ) {
    try {
      const product = await this.productsService.remove(id, authorization);
      return product;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
