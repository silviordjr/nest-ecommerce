import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
  Headers,
  HttpException,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { HttpExceptionFilter } from './../exceptions/http-exception.filter';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @UseFilters(HttpExceptionFilter)
  async create(
    @Body() createSaleDto: CreateSaleDto,
    @Headers('authorization') authorization: string,
  ) {
    try {
      const sale = await this.salesService.create(createSaleDto, authorization);
      return sale;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get()
  @UseFilters(HttpExceptionFilter)
  findAll() {
    return this.salesService.findAll();
  }

  @Get(':id')
  @UseFilters(HttpExceptionFilter)
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(+id);
  }

  @Patch(':id')
  @UseFilters(HttpExceptionFilter)
  update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto) {
    return this.salesService.update(+id, updateSaleDto);
  }

  @Delete(':id')
  @UseFilters(HttpExceptionFilter)
  remove(@Param('id') id: string) {
    return this.salesService.remove(+id);
  }
}
