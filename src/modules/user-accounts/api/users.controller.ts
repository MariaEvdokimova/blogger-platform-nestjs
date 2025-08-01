import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBasicAuth, ApiParam } from '@nestjs/swagger';
import { UsersQueryRepository } from '../infrastructure/query/users.query-repository';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { BasicAuthGuard } from '../guards/basic/basic-auth.guard';
import { GetUsersQueryParams } from './input-dto/get-users-query-params.input-dto';
import { UserViewDto } from './view-dto/users.view-dto';
import { CreateUserInputDto } from './input-dto/users.input-dto';
import { ObjectIdValidationPipe } from '../../../core/pipes/object-id-validation-transformation-pipe.service';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../application/usecases/admins/create-user.usecase';
import { DeleteUserCommand } from '../application/usecases/admins/delete-user.usecase';
import { GetUsersQuery } from '../application/queries/get-users.query';
 
@Controller('users')
@UseGuards(BasicAuthGuard)
@ApiBasicAuth('basicAuth')
export class UsersController {
  constructor(
    private usersQueryRepository: UsersQueryRepository,    
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {
    //console.log('UsersController created');
  }
 
  @Get()
  async getAll(@Query() query: GetUsersQueryParams): Promise<PaginatedViewDto<UserViewDto[]>> {
    return this.queryBus.execute(new GetUsersQuery( query ));
    //return this.usersQueryRepository.getAll( query );
  }
 
  @Post()
  async createUser(@Body() body: CreateUserInputDto): Promise<UserViewDto> {
    const userId = await this.commandBus.execute<
      CreateUserCommand,
      string
    >(new CreateUserCommand(body));
    
    //const userId = await this.usersService.createUser(body);
 
    return this.usersQueryRepository.getByIdOrNotFoundFail(userId);
  }
 
  @ApiParam({ name: 'id' }) //для сваггера
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id', ObjectIdValidationPipe) id: string, //ObjectIdValidationTransformationPipe) id: Types.ObjectId,//
  ): Promise<void> {
    return this.commandBus.execute(new DeleteUserCommand(id));
    //return this.usersService.deleteUser(id);
  }
}
