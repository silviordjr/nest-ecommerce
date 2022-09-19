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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpExceptionFilter } from './../exceptions/http-exception.filter';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseFilters(HttpExceptionFilter)
  create(
    @Body() createUserDto: CreateUserDto,
    @Headers('authorization') authorization: string,
  ) {
    try {
      return this.usersService.create(createUserDto, authorization);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get()
  @UseFilters(HttpExceptionFilter)
  async findAll(@Headers('authorization') authorization: string) {
    try {
      return this.usersService.findAll(authorization);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get(':id')
  @UseFilters(HttpExceptionFilter)
  findOne(
    @Param('id') id: string,
    @Headers('authorization') authorization: string,
  ) {
    try {
      return this.usersService.findOne(id, authorization);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Patch()
  @UseFilters(HttpExceptionFilter)
  async update(@Body() updateUserDto: UpdateUserDto) {
    try {
      const token = await this.usersService.update(updateUserDto);
      return token;
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
      const remove = await this.usersService.remove(id, authorization);
      return remove;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
